import { useState, useCallback } from 'react';
import { useMsal, useAccount } from '@azure/msal-react';
import type { AccountInfo } from '@azure/msal-browser';
import { useAzureAuthContext } from './AzureAuthProvider';

/**
 * Microsoft Graph user profile data
 */
export interface GraphUserProfile {
  id: string;
  displayName: string;
  givenName?: string;
  surname?: string;
  mail?: string;
  userPrincipalName: string;
  jobTitle?: string;
  department?: string;
  officeLocation?: string;
  mobilePhone?: string;
  businessPhones?: string[];
}

/**
 * Azure auth hook result
 */
export interface UseAzureAuthResult {
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether authentication is in progress */
  isLoading: boolean;
  /** Current MSAL account */
  account: AccountInfo | null;
  /** User display name */
  userName: string | null;
  /** User email */
  userEmail: string | null;
  /** Microsoft Graph profile (fetched on demand) */
  graphProfile: GraphUserProfile | null;
  /** Whether graph profile is loading */
  graphLoading: boolean;
  /** Initiate login */
  login: () => Promise<void>;
  /** Initiate logout */
  logout: () => Promise<void>;
  /** Get access token for API calls */
  getAccessToken: () => Promise<string | null>;
  /** Fetch user profile from Microsoft Graph */
  fetchGraphProfile: () => Promise<GraphUserProfile | null>;
}

const GRAPH_ME_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

/**
 * useAzureAuth - Hook for Azure AD authentication
 * 
 * @example
 * function MyComponent() {
 *   const { isAuthenticated, userName, login, logout, getAccessToken } = useAzureAuth();
 *   
 *   const handleApiCall = async () => {
 *     const token = await getAccessToken();
 *     const response = await fetch('/api/data', {
 *       headers: { Authorization: 'Bearer ' + token }
 *     });
 *   };
 *   
 *   if (!isAuthenticated) {
 *     return <button onClick={login}>Sign In</button>;
 *   }
 *   
 *   return <div>Hello, {userName}!</div>;
 * }
 */
export function useAzureAuth(): UseAzureAuthResult {
  const context = useAzureAuthContext();
  const { } = useMsal(); // Keep hook call for MSAL context
  const msalAccount = useAccount();
  
  const [graphProfile, setGraphProfile] = useState<GraphUserProfile | null>(null);
  const [graphLoading, setGraphLoading] = useState(false);

  // Get account from context or MSAL hook
  const account = context.account || msalAccount;

  // Fetch Microsoft Graph profile
  const fetchGraphProfile = useCallback(async (): Promise<GraphUserProfile | null> => {
    if (!account) return null;

    setGraphLoading(true);
    try {
      const token = await context.getAccessToken();
      if (!token) return null;

      const response = await fetch(GRAPH_ME_ENDPOINT, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch graph profile');
      }

      const profile: GraphUserProfile = await response.json();
      setGraphProfile(profile);
      return profile;
    } catch (error) {
      console.error('[AzureAuth] Graph profile error:', error);
      return null;
    } finally {
      setGraphLoading(false);
    }
  }, [account, context]);

  return {
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    account,
    userName: account?.name || null,
    userEmail: account?.username || null,
    graphProfile,
    graphLoading,
    login: context.login,
    logout: context.logout,
    getAccessToken: context.getAccessToken,
    fetchGraphProfile,
  };
}
