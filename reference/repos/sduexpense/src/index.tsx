import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { currentEnvironment, loginRequest, msalConfig } from './auth';
import App from './components/App';
import './styles.css';

import axios from 'axios';
import moment from 'moment';
import 'moment/locale/da';

import { PublicClientApplication, EventType, InteractionRequiredAuthError } from '@azure/msal-browser';
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import config from './config';

// 1. Import pdfjs from react-pdf
import { pdfjs } from 'react-pdf';

// 2. Set the workerSrc – here we reference a CDN copy of the same version pdfjs is using
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

moment.locale('da');

axios.defaults.baseURL = config.config.pathToApi;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.maxRedirects = 0;
axios.defaults.withCredentials = false;

const PATHS = {
    LOCAL: 'http://localhost:3000', // Changed to use DEV API endpoint
    DEV: 'https://sduexpense-dev.sdu.dk/',
    PROD: 'https://sduexpense.sdu.dk/'
} as const;

const pathForNavigation = PATHS[currentEnvironment];

const msalInstance = new PublicClientApplication(msalConfig);

if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

msalInstance.addEventCallback((event: any) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload?.account) {
        const account = event.payload.account;
        msalInstance.setActiveAccount(account);
    }
});

const container = document.getElementById('root');
const root = createRoot(container!);

const Login = () => {

    const { instance } = useMsal();
    const [account, setAccount] = useState<any>(null);
    const [activeAccount, setActiveAccount] = useState(instance.getActiveAccount());
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            await new Promise(resolve => setTimeout(resolve, 100)); // Simulating async init
            setIsInitialized(true);
        };

        initialize();
    }, []);

    useEffect(() => {
        if (isInitialized) {
            instance.handleRedirectPromise().then(response => {
                // 1. Handle redirect return
                if (response && response.state) {
                    try {
                        const parsedState = JSON.parse(response.state);
                        if (parsedState.returnUrl && parsedState.returnUrl !== window.location.href) {
                            window.location.href = parsedState.returnUrl;
                            return;
                        }
                    } catch (e) {
                        console.error('Failed to parse redirect state', e);
                    }
                }

                // 2. Ensure account is set
                let currentAccount = instance.getActiveAccount();
                if (!currentAccount && response?.account) {
                    instance.setActiveAccount(response.account);
                    currentAccount = response.account;
                }
                
                if (currentAccount) {
                    setActiveAccount(currentAccount);
                }

                // 3. Login or Acquire Token
                if (!currentAccount) {
                    instance.loginRedirect({
                        ...loginRequest,
                        state: JSON.stringify({
                            returnUrl: window.location.href
                        })
                    }).catch((error) => console.error('Login redirect failed:', error));
                } else {
                    instance.acquireTokenSilent({
                        ...loginRequest,
                        account: currentAccount,
                        redirectUri: pathForNavigation,
                        forceRefresh: false,
                    })
                    .then((response) => {
                        setAccount(response);
                    })
                    .catch((error) => {
                        if (error instanceof InteractionRequiredAuthError) {
                            // Use redirect instead of popup for mobile/Edge compatibility
                            console.log('Interaction required, redirecting to login...');
                            instance.loginRedirect({
                                ...loginRequest,
                                account: currentAccount || undefined,
                                state: JSON.stringify({
                                    returnUrl: window.location.href
                                })
                            }).catch((redirectError) => console.error('Login redirect failed:', redirectError));
                        } else if (error.errorCode === 'block_iframe_reload') {
                            console.log('Iframe reload blocked (expected behavior)');
                        } else if (error.errorCode === 'monitor_window_timeout') {
                            // Use redirect instead of popup for mobile/Edge compatibility
                            console.warn('Silent auth timeout, redirecting to login...');
                            instance.loginRedirect({
                                ...loginRequest,
                                account: currentAccount || undefined,
                                state: JSON.stringify({
                                    returnUrl: window.location.href
                                })
                            }).catch((redirectError) => console.error('Login redirect failed:', redirectError));
                        } else {
                            console.error('Auth error:', error);
                        }
                    });
                }
            }).catch(error => {
                console.error('Handle redirect promise failed:', error);
            });
        }
    }, [isInitialized, instance]);

    return (
        <div className="App">
            <AuthenticatedTemplate>
                {account ? (
                    <App config={config} instance={instance} account={account} />
                ) : null}
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <p>Please sign in to continue.</p>
            </UnauthenticatedTemplate>
        </div>
    );
};

root.render(
    <MsalProvider instance={msalInstance}>
        <Login />
    </MsalProvider>
);
