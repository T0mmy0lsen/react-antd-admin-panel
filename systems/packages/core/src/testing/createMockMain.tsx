import React from 'react';
import { MainContext } from '../main/MainContext';
import { GlobalStore } from '../main/Store';
import { UserState } from '../main/UserState';
import type { MainInstance, MainConfig } from '../main/types';
import type { User } from '../types';
import { createMockHttp, MockHttp } from './createMockHttp';

/**
 * createMockMain - Create a mock MainProvider wrapper for testing
 * 
 * @example
 * import { createMockMain } from 'react-antd-admin-panel/testing';
 * import { render, screen } from '@testing-library/react';
 * 
 * const { wrapper, mockNavigate, mockHttp } = createMockMain({
 *   user: { id: '1', name: 'Test User', roles: ['admin'] },
 *   config: { pathToApi: '/api' }
 * });
 * 
 * render(<MyComponent />, { wrapper });
 * expect(screen.getByText('Hello')).toBeInTheDocument();
 */

/** Mock function interface compatible with Jest/Vitest */
export interface MockFunction {
  (...args: any[]): any;
  mock: { calls: any[][] };
  mockClear: () => void;
}

export interface MockMainOptions {
  /** Initial user data */
  user?: User;
  /** Initial store values */
  store?: Record<string, any>;
  /** Main configuration overrides */
  config?: Partial<MainConfig['config']>;
}

export interface MockMainResult {
  /** React wrapper component for testing-library */
  wrapper: React.FC<{ children: React.ReactNode }>;
  /** Mock navigate function spy */
  mockNavigate: MockFunction;
  /** Mock HTTP instance */
  mockHttp: MockHttp;
  /** Direct access to the mock Main instance */
  mainInstance: MainInstance;
  /** Direct access to UserState for manipulation */
  userState: UserState;
  /** Direct access to GlobalStore for manipulation */
  store: GlobalStore;
}

/**
 * Create a mock Main context wrapper for testing
 */
export function createMockMain(options: MockMainOptions = {}): MockMainResult {
  // Create instances
  const store = new GlobalStore();
  const userState = new UserState();
  const mockHttp = createMockHttp();

  // Initialize store with provided values
  if (options.store) {
    for (const [key, value] of Object.entries(options.store)) {
      store.set(key, value);
    }
  }

  // Initialize user with provided data
  if (options.user) {
    userState.set(options.user);
  }

  // Create mock navigate function with call tracking
  const calls: any[][] = [];
  const mockNavigate: MockFunction = Object.assign(
    (...args: any[]) => { calls.push(args); },
    {
      mock: { calls },
      mockClear: () => { calls.length = 0; },
    }
  );

  // Create the main instance
  const config = options.config || {};
  const mainInstance: MainInstance = {
    User: () => userState,
    Store: () => store,
    config: {
      pathToApi: config.pathToApi || '/api',
      defaultRoute: config.defaultRoute || '/',
      authRoute: config.authRoute || '/login',
      ...config,
    },
    navigate: mockNavigate,
    canAccess: (route) => {
      // Check required role
      if (route.requiredRole && !userState.hasRole(route.requiredRole)) {
        return false;
      }
      // Check required permissions
      if (route.requiredPermissions && !userState.hasAllPermissions(route.requiredPermissions)) {
        return false;
      }
      return true;
    },
  };

  // Create the wrapper component
  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return React.createElement(
      MainContext.Provider,
      { value: mainInstance },
      children
    );
  };

  return {
    wrapper,
    mockNavigate,
    mockHttp,
    mainInstance,
    userState,
    store,
  };
}
