import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { PublicClientApplication, EventType, InteractionRequiredAuthError, AccountInfo, AuthenticationResult } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import type { AzureAuthConfig } from './AzureAuthConfig';

/**
 * Azure Auth Context value
 */
export interface AzureAuthContextValue {
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether authentication is in progress */
  isLoading: boolean;
  /** Current account info */
  account: AccountInfo | null;
  /** Authentication result with tokens */
  authResult: AuthenticationResult | null;
  /** MSAL instance */
  msalInstance: PublicClientApplication;
  /** Auth configuration */
  config: AzureAuthConfig;
  /** Login function */
  login: () => Promise<void>;
  /** Logout function */
  logout: () => Promise<void>;
  /** Get access token for API calls */
  getAccessToken: () => Promise<string | null>;
}

const AzureAuthContext = createContext<AzureAuthContextValue | null>(null);

export interface AzureAuthProviderProps {
  /** Azure auth configuration from createAzureAuthConfig */
  config: AzureAuthConfig;
  /** Children to render */
  children: React.ReactNode;
  /** Called when authentication succeeds */
  onAuthenticated?: (result: AuthenticationResult) => void;
  /** Called when authentication fails */
  onError?: (error: Error) => void;
  /** Loading component to show during auth */
  loadingComponent?: React.ReactNode;
  /** Component to show when not authenticated (defaults to auto-login) */
  unauthenticatedComponent?: React.ReactNode;
  /** Disable auto-login on mount - if true, shows unauthenticatedComponent instead of redirecting */
  disableAutoLogin?: boolean;
}

/**
 * AzureAuthProvider - Wraps application with Azure AD authentication
 * 
 * @example
 * const authConfig = createAzureAuthConfig({
 *   clientId: '...',
 *   tenantId: '...',
 *   scopes: ['api://xxx/User'],
 * });
 * 
 * <AzureAuthProvider config={authConfig}>
 *   <App />
 * </AzureAuthProvider>
 */
export function AzureAuthProvider({
  config,
  children,
  onAuthenticated,
  onError,
  loadingComponent,
  unauthenticatedComponent,
  disableAutoLogin = false,
}: AzureAuthProviderProps): React.ReactElement {
  const [msalInstance] = useState(() => new PublicClientApplication(config.msalConfig));
  const [isLoading, setIsLoading] = useState(true);
  const [authResult, setAuthResult] = useState<AuthenticationResult | null>(null);
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const redirectHandled = useRef(false);

  // Initialize MSAL and handle redirect - runs once
  useEffect(() => {
    // Prevent double initialization in strict mode
    if (redirectHandled.current) return;
    redirectHandled.current = true;

    const initializeMsal = async () => {
      try {
        // Initialize MSAL instance first
        await msalInstance.initialize();
        
        // Small delay to ensure initialization is complete (from v1 pattern)
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Handle redirect response
        const response = await msalInstance.handleRedirectPromise();
        
        // Clear URL hash/params after handling redirect to prevent "query string too long"
        if (window.location.hash || window.location.search.includes('code=') || window.location.search.includes('state=')) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        if (response) {
          // We got a response from redirect - user just logged in
          msalInstance.setActiveAccount(response.account);
          setAccount(response.account);
          setAuthResult(response);
          onAuthenticated?.(response);
          setIsLoading(false);
          return;
        }

        // No redirect response - check for existing account
        let currentAccount: AccountInfo | null = msalInstance.getActiveAccount();
        if (!currentAccount) {
          const accounts = msalInstance.getAllAccounts();
          if (accounts.length > 0) {
            currentAccount = accounts[0] ?? null;
            if (currentAccount) {
              msalInstance.setActiveAccount(currentAccount);
            }
          }
        }

        if (currentAccount) {
          setAccount(currentAccount);
          
          // Try silent token acquisition
          try {
            const silentResult = await msalInstance.acquireTokenSilent({
              ...config.loginRequest,
              account: currentAccount,
              redirectUri: config.msalConfig.auth.redirectUri,
              forceRefresh: false,
            });
            setAuthResult(silentResult);
            onAuthenticated?.(silentResult);
            setIsLoading(false);
          } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
              console.log('[AzureAuth] Interaction required, need to login');
              // Need interactive login
              if (!disableAutoLogin) {
                await msalInstance.loginRedirect(config.loginRequest);
                return; // Don't set loading false - we're redirecting
              }
            } else {
              const errorObj = error as Error;
              // Ignore certain expected errors
              if (errorObj.message?.includes('block_iframe_reload') || 
                  errorObj.message?.includes('monitor_window_timeout')) {
                console.log('[AzureAuth] Expected error during silent auth:', errorObj.message);
              } else {
                console.error('[AzureAuth] Silent token error:', error);
                onError?.(errorObj);
              }
            }
            setIsLoading(false);
          }
        } else {
          // No account at all
          if (!disableAutoLogin) {
            // Redirect to login
            await msalInstance.loginRedirect(config.loginRequest);
            return; // Don't set loading false - we're redirecting
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('[AzureAuth] Initialization error:', error);
        onError?.(error as Error);
        setIsLoading(false);
      }
    };

    initializeMsal();

    // Add event callback for login success
    const callbackId = msalInstance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const payload = event.payload as AuthenticationResult;
        if (payload.account) {
          msalInstance.setActiveAccount(payload.account);
          setAccount(payload.account);
          setAuthResult(payload);
          onAuthenticated?.(payload);
        }
      }
    });

    return () => {
      if (callbackId) {
        msalInstance.removeEventCallback(callbackId);
      }
    };
  }, []); // Empty deps - only run once

  // Login function
  const login = useCallback(async () => {
    try {
      await msalInstance.loginRedirect(config.loginRequest);
    } catch (error) {
      console.error('[AzureAuth] Login error:', error);
      onError?.(error as Error);
    }
  }, [msalInstance, config, onError]);

  // Logout function - clear all cached data
  const logout = useCallback(async () => {
    try {
      // Clear account state first
      setAccount(null);
      setAuthResult(null);
      
      // Logout with post redirect back to current origin
      await msalInstance.logoutRedirect({
        postLogoutRedirectUri: window.location.origin,
      });
    } catch (error) {
      console.error('[AzureAuth] Logout error:', error);
      onError?.(error as Error);
    }
  }, [msalInstance, onError]);

  // Get access token
  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const currentAccount = msalInstance.getActiveAccount();
    if (!currentAccount) {
      return null;
    }

    try {
      const result = await msalInstance.acquireTokenSilent({
        ...config.loginRequest,
        account: currentAccount,
      });
      return result.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        await msalInstance.loginRedirect(config.loginRequest);
      }
      return null;
    }
  }, [msalInstance, config]);

  // Context value
  const contextValue = useMemo<AzureAuthContextValue>(() => ({
    isAuthenticated: !!account,
    isLoading,
    account,
    authResult,
    msalInstance,
    config,
    login,
    logout,
    getAccessToken,
  }), [account, isLoading, authResult, msalInstance, config, login, logout, getAccessToken]);

  // Loading state - wait for MSAL to initialize
  if (isLoading) {
    return (
      <MsalProvider instance={msalInstance}>
        {loadingComponent || (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            Loading...
          </div>
        )}
      </MsalProvider>
    );
  }

  // Use our own account state instead of MSAL templates for more reliable sync
  const isAuthenticated = !!account;

  return (
    <MsalProvider instance={msalInstance}>
      <AzureAuthContext.Provider value={contextValue}>
        {isAuthenticated ? (
          children
        ) : (
          unauthenticatedComponent || (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              Please sign in to continue.
            </div>
          )
        )}
      </AzureAuthContext.Provider>
    </MsalProvider>
  );
}

/**
 * Hook to access Azure Auth context (internal use)
 */
export function useAzureAuthContext(): AzureAuthContextValue {
  const context = useContext(AzureAuthContext);
  if (!context) {
    throw new Error('useAzureAuth must be used within an AzureAuthProvider');
  }
  return context;
}
