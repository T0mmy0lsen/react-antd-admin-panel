import { PublicClientApplication } from '@azure/msal-browser';

/**
 * 🎯 ENVIRONMENT CONFIGURATION
 * 
 * To switch environments, simply change CURRENT_ENVIRONMENT below:
 * - 'LOCAL': For local development (localhost:3000)  
 * - 'DEV': For development server (sduexpense-dev.sdu.dk)
 * - 'PROD': For production (sduexpense.sdu.dk)
 * 
 * This will automatically update:
 * - Authentication URLs and client IDs
 * - API endpoints (via config.ts)
 * - Redirect URIs
 * - Debug settings
 */

// 🎯 SINGLE POINT OF CONTROL - Change this to switch environments
type Environment = 'LOCAL' | 'DEV' | 'PROD';
const CURRENT_ENVIRONMENT: Environment = 'PROD';

// Environment Configurations
const ENVIRONMENT_CONFIGS = {
    LOCAL: {
        name: 'Local Development',
        clientId: "14e58560-ce8f-4309-83cc-b9b78ca2b39c",
        authority: "https://login.microsoftonline.com/9a97c27d-b83e-4694-b353-54bdbf18ab5b",
        scope: "api://e945a1ba-85ec-4ea5-81cc-620d2221d920/zExpense_User",
        redirectUri: "http://localhost:3000",
        baseUrl: "http://localhost:3000"
    },
    DEV: {
        name: 'Development Server',
        clientId: "14e58560-ce8f-4309-83cc-b9b78ca2b39c",
        authority: "https://login.microsoftonline.com/9a97c27d-b83e-4694-b353-54bdbf18ab5b",
        scope: "api://e945a1ba-85ec-4ea5-81cc-620d2221d920/zExpense_User",
        redirectUri: "https://sduexpense-dev.sdu.dk/",
        baseUrl: "https://sduexpense-dev.sdu.dk/"
    },
    PROD: {
        name: 'Production',
        clientId: "46b3bb70-f692-4eca-9cc4-c0fda5ebc411",
        authority: "https://login.microsoftonline.com/9a97c27d-b83e-4694-b353-54bdbf18ab5b",
        scope: "api://2795256b-babb-43eb-a88e-4e7f852c55ff/zExpense_User",
        redirectUri: "https://sduexpense.sdu.dk/",
        baseUrl: "https://sduexpense.sdu.dk/"
    }
} as const;

// Get active configuration
const activeConfig = ENVIRONMENT_CONFIGS[CURRENT_ENVIRONMENT];

// Console log for debugging
console.log(`🔧 Auth Environment: ${activeConfig.name} (${CURRENT_ENVIRONMENT})`);
console.log(`🔗 Base URL: ${activeConfig.baseUrl}`);

// Export configuration for use in other files
export const currentEnvironment = CURRENT_ENVIRONMENT;
export const environmentConfig = activeConfig;

// Helper functions for environment checks  
export const isLocal = () => (currentEnvironment as Environment) === 'LOCAL';
export const isDev = () => (currentEnvironment as Environment) === 'DEV';
export const isProd = () => (currentEnvironment as Environment) === 'PROD';
export const isProduction = isProd; // Alias for backward compatibility

let clientId = activeConfig.clientId;
let authority = activeConfig.authority;
let scope = activeConfig.scope;

const url = new URL(window.location.href);
const existingParams = url.search;
const redirectUrl = url.origin + url.pathname + existingParams;

export const msalConfig = {
    auth: {
        clientId: clientId,
        authority: activeConfig.authority,
        redirectUri: activeConfig.redirectUri,
        navigateToLoginRequestUrl: false, // Prevents iframe reload issues
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
    },
    system: {
        allowNativeBroker: false, // Disables WAM Broker
        windowHashTimeout: 9000,
        iframeHashTimeout: 9000,
        loadFrameTimeout: 9000,
        navigateFrameWait: 0, // Prevents waiting for iframe navigation
    }
};

export const loginRequest = {
    scopes: [
        scope,
        "openid",
        "User.Read",
        "offline_access"
    ]
};
