import React from 'react';
import type { MainInstance, MainConfig } from './types';
import { GlobalStore } from './Store';
import { UserState } from './UserState';
import { Get } from '../http/Get';
import { Post } from '../http/Post';

/**
 * Main context for accessing app instance throughout the component tree
 */
export const MainContext = React.createContext<MainInstance | null>(null);

/**
 * Hook to access the Main instance
 */
export function useMain(): MainInstance {
  const context = React.useContext(MainContext);
  if (!context) {
    throw new Error('useMain must be used within a MainProvider');
  }
  return context;
}

/**
 * Hook to access the current user
 */
export function useUser() {
  const main = useMain();
  const [user, setUser] = React.useState(main.User().get());

  React.useEffect(() => {
    return main.User().subscribe(setUser);
  }, [main]);

  return user;
}

/**
 * Hook to access a store value
 */
export function useStore<T = any>(key: string): T | undefined {
  const main = useMain();
  const [value, setValue] = React.useState<T | undefined>(main.Store().get(key));

  React.useEffect(() => {
    return main.Store().subscribe<T>(key, setValue);
  }, [main, key]);

  return value;
}

/**
 * Hook to set store values
 */
export function useStoreActions() {
  const main = useMain();
  return {
    set: <T,>(key: string, value: T) => main.Store().set(key, value),
    remove: (key: string) => main.Store().remove(key),
    clear: () => main.Store().clear(),
  };
}

interface MainProviderProps {
  config: MainConfig;
  navigate: (path: string) => void;
  children: React.ReactNode;
}

/**
 * MainProvider - Provides the Main context to the application
 */
export function MainProvider({ config, navigate, children }: MainProviderProps): React.ReactElement {
  // Create stable instances
  const storeRef = React.useRef<GlobalStore>(new GlobalStore());
  const userStateRef = React.useRef<UserState>(new UserState());
  const [booted, setBooted] = React.useState(false);
  const [bootError, setBootError] = React.useState<Error | null>(null);

  // Create the main instance
  const mainInstance = React.useMemo<MainInstance>(() => ({
    User: () => userStateRef.current,
    Store: () => storeRef.current,
    config: config.config,
    navigate,
    canAccess: (route) => {
      const user = userStateRef.current;
      
      // Check required role
      if (route.requiredRole && !user.hasRole(route.requiredRole)) {
        return false;
      }
      
      // Check required permissions
      if (route.requiredPermissions && !user.hasAllPermissions(route.requiredPermissions)) {
        return false;
      }
      
      return true;
    },
  }), [config.config, navigate]);

  // Configure HTTP on mount
  React.useEffect(() => {
    const httpConfig = config.config.http;
    if (httpConfig) {
      Get.configure({
        baseURL: httpConfig.baseURL || config.config.pathToApi,
        timeout: httpConfig.timeout,
        headers: httpConfig.headers,
      });
      Post.configure({
        baseURL: httpConfig.baseURL || config.config.pathToApi,
        timeout: httpConfig.timeout,
        headers: httpConfig.headers,
      });

      // Set up interceptors if provided
      if (httpConfig.onRequest || httpConfig.onResponse || httpConfig.onError || httpConfig.onUnauthorized) {
        const axios = Get.getAxios();
        
        if (httpConfig.onRequest) {
          axios.interceptors.request.use(httpConfig.onRequest);
        }
        
        if (httpConfig.onResponse || httpConfig.onError || httpConfig.onUnauthorized) {
          axios.interceptors.response.use(
            httpConfig.onResponse,
            (error) => {
              if (error.response?.status === 401 && httpConfig.onUnauthorized) {
                httpConfig.onUnauthorized();
              }
              if (httpConfig.onError) {
                return httpConfig.onError(error);
              }
              return Promise.reject(error);
            }
          );
        }
      }
    }
  }, [config.config.http, config.config.pathToApi]);

  // Run boot sequence
  React.useEffect(() => {
    const runBoot = async () => {
      try {
        if (config.config.boot) {
          await config.config.boot(mainInstance);
        }
        setBooted(true);
      } catch (error) {
        setBootError(error as Error);
      }
    };

    runBoot();
  }, [config.config.boot, mainInstance]);

  // Show loading or error during boot
  if (bootError) {
    return React.createElement('div', {
      style: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 16,
      },
    },
      React.createElement('h2', {}, 'Application Error'),
      React.createElement('p', { style: { color: 'red' } }, bootError.message),
    );
  }

  if (!booted && config.config.boot) {
    return React.createElement('div', {
      style: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
      },
    },
      React.createElement('span', {}, 'Loading...'),
    );
  }

  return React.createElement(
    MainContext.Provider,
    { value: mainInstance },
    children,
  );
}
