/**
 * Auth Module - Azure AD / MSAL Authentication
 * 
 * Provides Azure AD authentication with MSAL for React applications.
 * 
 * @example
 * import { createAzureAuthConfig, AzureAuthProvider, useAzureAuth } from 'react-antd-admin-panel/auth';
 * 
 * const authConfig = createAzureAuthConfig({
 *   clientId: 'your-client-id',
 *   tenantId: 'your-tenant-id',
 *   scopes: ['api://xxx/User'],
 * });
 * 
 * <AzureAuthProvider config={authConfig}>
 *   <App />
 * </AzureAuthProvider>
 */

export { createAzureAuthConfig, type AzureAuthConfig, type AzureEnvironment, type AzureAuthOptions } from './AzureAuthConfig';
export { AzureAuthProvider } from './AzureAuthProvider';
export { useAzureAuth } from './useAzureAuth';
export { AzureLoginButton } from './AzureLoginButton';
