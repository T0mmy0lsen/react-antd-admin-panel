import type { Configuration, RedirectRequest } from '@azure/msal-browser';

/**
 * Azure environment type
 */
export type AzureEnvironment = 'LOCAL' | 'DEV' | 'PROD';

/**
 * Azure authentication configuration options
 */
export interface AzureAuthOptions {
  /** Azure AD Client ID (Application ID) */
  clientId: string;
  /** Azure AD Tenant ID (optional if authority is provided) */
  tenantId?: string;
  /** API scopes to request (e.g., ['api://xxx/User']) */
  scopes: string[];
  /** Current environment */
  environment?: AzureEnvironment;
  /** Redirect URI after login (defaults to window.location.origin) */
  redirectUri?: string;
  /** Enable debug logging */
  debug?: boolean;
  /** Custom authority URL (overrides tenantId-based authority) */
  authority?: string;
  /** Cache location: localStorage or sessionStorage */
  cacheLocation?: 'localStorage' | 'sessionStorage';
  /** Additional scopes to always include */
  additionalScopes?: string[];
}

/**
 * Resolved Azure authentication configuration
 */
export interface AzureAuthConfig {
  /** MSAL configuration object */
  msalConfig: Configuration;
  /** Login request with scopes */
  loginRequest: RedirectRequest;
  /** Current environment */
  environment: AzureEnvironment;
  /** Helper: is local environment */
  isLocal: boolean;
  /** Helper: is dev environment */
  isDev: boolean;
  /** Helper: is prod environment */
  isProd: boolean;
  /** Original options for reference */
  options: AzureAuthOptions;
}

/**
 * Create Azure AD authentication configuration
 * 
 * @example
 * const authConfig = createAzureAuthConfig({
 *   clientId: '12345678-1234-1234-1234-123456789012',
 *   tenantId: '87654321-4321-4321-4321-210987654321',
 *   scopes: ['api://my-api/User.Read'],
 *   environment: 'PROD',
 * });
 */
export function createAzureAuthConfig(options: AzureAuthOptions): AzureAuthConfig {
  const {
    clientId,
    tenantId,
    scopes,
    environment = 'PROD',
    redirectUri,
    debug = false,
    authority,
    cacheLocation = 'localStorage',
    additionalScopes = [],
  } = options;

  // Determine redirect URI
  const resolvedRedirectUri = redirectUri || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

  // Build authority URL
  const resolvedAuthority = authority || 'https://login.microsoftonline.com/' + tenantId;

  // Debug logging
  if (debug) {
    console.log('[AzureAuth] Environment:', environment);
    console.log('[AzureAuth] Client ID:', clientId);
    console.log('[AzureAuth] Authority:', resolvedAuthority);
    console.log('[AzureAuth] Redirect URI:', resolvedRedirectUri);
    console.log('[AzureAuth] Scopes:', scopes);
  }

  // Build MSAL configuration
  const msalConfig: Configuration = {
    auth: {
      clientId,
      authority: resolvedAuthority,
      redirectUri: resolvedRedirectUri,
      navigateToLoginRequestUrl: false,
    },
    cache: {
      cacheLocation,
      storeAuthStateInCookie: false,
    },
    system: {
      windowHashTimeout: 9000,
      iframeHashTimeout: 9000,
      loadFrameTimeout: 9000,
    },
  };

  // Build login request
  const loginRequest: RedirectRequest = {
    scopes: [
      ...scopes,
      'openid',
      'User.Read',
      'offline_access',
      ...additionalScopes,
    ],
  };

  return {
    msalConfig,
    loginRequest,
    environment,
    isLocal: environment === 'LOCAL',
    isDev: environment === 'DEV',
    isProd: environment === 'PROD',
    options,
  };
}
