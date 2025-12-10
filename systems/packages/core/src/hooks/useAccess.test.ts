import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { useAccess } from './useAccess';
import { MainContext } from '../main/MainContext';
import type { MainInstance } from '../main/types';
import { UserState } from '../main/UserState';
import { GlobalStore } from '../main/Store';

// Helper to create a mock MainInstance
function createMockMain(user: any = null): MainInstance {
  const userState = new UserState();
  if (user) {
    userState.set(user);
  }
  
  return {
    User: () => userState,
    Store: () => new GlobalStore(),
    config: {},
    navigate: vi.fn(),
    canAccess: () => true,
  };
}

// Wrapper component that provides MainContext
function createWrapper(user: any = null) {
  const mainInstance = createMockMain(user);
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      MainContext.Provider,
      { value: mainInstance },
      children
    );
  };
}

describe('useAccess', () => {
  describe('isAuthenticated', () => {
    it('should return false when no user', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper(null),
      });

      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should return true when user is set', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper({ id: 1, name: 'John' }),
      });

      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('currentRole', () => {
    it('should return undefined when no user', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper(null),
      });

      expect(result.current.currentRole).toBeUndefined();
    });

    it('should return user role', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper({ id: 1, role: 'admin' }),
      });

      expect(result.current.currentRole).toBe('admin');
    });
  });

  describe('hasRole', () => {
    it('should return true when user has the role', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper({ id: 1, role: 'admin' }),
      });

      expect(result.current.hasRole('admin')).toBe(true);
    });

    it('should return false when user has different role', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper({ id: 1, role: 'user' }),
      });

      expect(result.current.hasRole('admin')).toBe(false);
    });

    it('should return false when no user', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper(null),
      });

      expect(result.current.hasRole('admin')).toBe(false);
    });
  });

  describe('hasAnyRole', () => {
    it('should return true when user has one of the roles', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper({ id: 1, role: 'manager' }),
      });

      expect(result.current.hasAnyRole(['admin', 'manager'])).toBe(true);
    });

    it('should return false when user has none of the roles', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper({ id: 1, role: 'user' }),
      });

      expect(result.current.hasAnyRole(['admin', 'manager'])).toBe(false);
    });
  });

  describe('hasPermission', () => {
    it('should return true when user has the permission', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper({ 
          id: 1, 
          permissions: ['users.read', 'users.write'] 
        }),
      });

      expect(result.current.hasPermission('users.read')).toBe(true);
    });

    it('should return false when user lacks the permission', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper({ 
          id: 1, 
          permissions: ['users.read'] 
        }),
      });

      expect(result.current.hasPermission('users.delete')).toBe(false);
    });

    it('should return false when user has no permissions', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper({ id: 1 }),
      });

      expect(result.current.hasPermission('users.read')).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('should return true when user has all permissions', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper({ 
          id: 1, 
          permissions: ['users.read', 'users.write', 'users.delete'] 
        }),
      });

      expect(result.current.hasAllPermissions(['users.read', 'users.write'])).toBe(true);
    });

    it('should return false when user is missing a permission', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper({ 
          id: 1, 
          permissions: ['users.read'] 
        }),
      });

      expect(result.current.hasAllPermissions(['users.read', 'users.write'])).toBe(false);
    });
  });

  describe('hasAnyPermission', () => {
    it('should return true when user has at least one permission', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper({ 
          id: 1, 
          permissions: ['users.read'] 
        }),
      });

      expect(result.current.hasAnyPermission(['users.read', 'users.delete'])).toBe(true);
    });

    it('should return false when user has none of the permissions', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper({ 
          id: 1, 
          permissions: ['orders.read'] 
        }),
      });

      expect(result.current.hasAnyPermission(['users.read', 'users.delete'])).toBe(false);
    });
  });

  describe('hasFeature', () => {
    it('should return true when user has feature with sufficient level', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper({ 
          id: 1, 
          features: { 'Users': 3, 'Reports': 1 } 
        }),
      });

      expect(result.current.hasFeature('Users', 2)).toBe(true);
      expect(result.current.hasFeature('Users', 3)).toBe(true);
    });

    it('should return false when user has feature with insufficient level', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper({ 
          id: 1, 
          features: { 'Users': 1 } 
        }),
      });

      expect(result.current.hasFeature('Users', 3)).toBe(false);
    });

    it('should return false when user lacks the feature', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper({ 
          id: 1, 
          features: { 'Reports': 1 } 
        }),
      });

      expect(result.current.hasFeature('Users', 1)).toBe(false);
    });

    it('should default to level 1 when not specified', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper({ 
          id: 1, 
          features: { 'Users': 1 } 
        }),
      });

      expect(result.current.hasFeature('Users')).toBe(true);
    });
  });

  describe('canAccess', () => {
    it('should return false when not authenticated', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper(null),
      });

      expect(result.current.canAccess({ role: 'admin' })).toBe(false);
    });

    it('should check feature access', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper({ 
          id: 1, 
          features: { 'Users': 3 } 
        }),
      });

      expect(result.current.canAccess({ feature: 'Users', level: 2 })).toBe(true);
      expect(result.current.canAccess({ feature: 'Users', level: 5 })).toBe(false);
    });

    it('should check role access', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper({ id: 1, role: 'admin' }),
      });

      expect(result.current.canAccess({ role: 'admin' })).toBe(true);
      expect(result.current.canAccess({ role: 'user' })).toBe(false);
    });

    it('should check multiple roles access', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper({ id: 1, role: 'manager' }),
      });

      expect(result.current.canAccess({ roles: ['admin', 'manager'] })).toBe(true);
      expect(result.current.canAccess({ roles: ['admin', 'superuser'] })).toBe(false);
    });

    it('should check permission access', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper({ 
          id: 1, 
          permissions: ['users.read', 'users.write'] 
        }),
      });

      expect(result.current.canAccess({ permission: 'users.read' })).toBe(true);
      expect(result.current.canAccess({ permission: 'users.delete' })).toBe(false);
    });

    it('should check multiple permissions access', () => {
      const { result } = renderHook(() => useAccess(), {
        wrapper: createWrapper({ 
          id: 1, 
          permissions: ['users.read', 'users.write'] 
        }),
      });

      expect(result.current.canAccess({ permissions: ['users.read', 'users.write'] })).toBe(true);
      expect(result.current.canAccess({ permissions: ['users.read', 'users.delete'] })).toBe(false);
    });
  });
});
