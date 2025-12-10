import { useCallback, useMemo } from 'react';
import { useUser } from '../main/MainContext';

/**
 * Feature-based access check configuration
 */
export interface FeatureAccess {
  /** Feature name/identifier */
  feature: string;
  /** Required access level (higher = more permissions) */
  level?: number;
}

/**
 * Access check configuration - can be feature-based or role-based
 */
export type AccessCheck = 
  | FeatureAccess
  | { role: string }
  | { roles: string[] }
  | { permission: string }
  | { permissions: string[] };

/**
 * Return type for the useAccess hook
 */
export interface UseAccessResult {
  /** Check if user can access based on configuration */
  canAccess: (check: AccessCheck) => boolean;
  /** Check if user has a specific role */
  hasRole: (role: string) => boolean;
  /** Check if user has any of the specified roles */
  hasAnyRole: (roles: string[]) => boolean;
  /** Check if user has a specific permission */
  hasPermission: (permission: string) => boolean;
  /** Check if user has all specified permissions */
  hasAllPermissions: (permissions: string[]) => boolean;
  /** Check if user has any of the specified permissions */
  hasAnyPermission: (permissions: string[]) => boolean;
  /** Check if user has access to a feature with optional level */
  hasFeature: (feature: string, level?: number) => boolean;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Current user's role */
  currentRole: string | undefined;
}

/**
 * useAccess - React hook for permission and access control checks
 * 
 * Provides functions to check user roles, permissions, and feature access.
 * Integrates with the UserState from Main context.
 * 
 * @returns Hook result with access check functions
 * 
 * @example
 * ```tsx
 * // Basic role check
 * const { hasRole, isAuthenticated } = useAccess();
 * if (!isAuthenticated) return <LoginPage />;
 * if (hasRole('admin')) return <AdminPanel />;
 * 
 * // Permission check
 * const { hasPermission } = useAccess();
 * const canEdit = hasPermission('users.edit');
 * 
 * // Feature-based access
 * const { canAccess } = useAccess();
 * if (canAccess({ feature: 'Users', level: 3 })) {
 *   // Show delete button
 * }
 * 
 * // Multiple roles
 * const { hasAnyRole } = useAccess();
 * if (hasAnyRole(['admin', 'manager'])) {
 *   // Show management features
 * }
 * 
 * // Combined check
 * const { canAccess } = useAccess();
 * <button disabled={!canAccess({ role: 'admin' })}>
 *   Admin Action
 * </button>
 * ```
 */
export function useAccess(): UseAccessResult {
  const user = useUser();

  /**
   * Check if user has a specific role
   */
  const hasRole = useCallback((role: string): boolean => {
    return user?.role === role;
  }, [user?.role]);

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = useCallback((roles: string[]): boolean => {
    if (!user?.role) return false;
    return roles.includes(user.role);
  }, [user?.role]);

  /**
   * Check if user has a specific permission
   */
  const hasPermission = useCallback((permission: string): boolean => {
    return user?.permissions?.includes(permission) ?? false;
  }, [user?.permissions]);

  /**
   * Check if user has all specified permissions
   */
  const hasAllPermissions = useCallback((permissions: string[]): boolean => {
    if (!user?.permissions) return false;
    return permissions.every(p => user.permissions!.includes(p));
  }, [user?.permissions]);

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    if (!user?.permissions) return false;
    return permissions.some(p => user.permissions!.includes(p));
  }, [user?.permissions]);

  /**
   * Check if user has access to a feature with optional level
   * 
   * Features are stored in user.features as Record<string, number>
   * where the number represents the access level
   */
  const hasFeature = useCallback((feature: string, level: number = 1): boolean => {
    if (!user?.features) return false;
    const userLevel = user.features[feature];
    if (userLevel === undefined) return false;
    return userLevel >= level;
  }, [user?.features]);

  /**
   * Unified access check supporting multiple check types
   */
  const canAccess = useCallback((check: AccessCheck): boolean => {
    // Not authenticated = no access
    if (!user) return false;

    // Feature-based check
    if ('feature' in check) {
      return hasFeature(check.feature, check.level);
    }

    // Single role check
    if ('role' in check) {
      return hasRole(check.role);
    }

    // Multiple roles check (any)
    if ('roles' in check) {
      return hasAnyRole(check.roles);
    }

    // Single permission check
    if ('permission' in check) {
      return hasPermission(check.permission);
    }

    // Multiple permissions check (all)
    if ('permissions' in check) {
      return hasAllPermissions(check.permissions);
    }

    return false;
  }, [user, hasFeature, hasRole, hasAnyRole, hasPermission, hasAllPermissions]);

  /**
   * Whether user is authenticated
   */
  const isAuthenticated = useMemo(() => user !== null, [user]);

  /**
   * Current user's role
   */
  const currentRole = useMemo(() => user?.role, [user?.role]);

  return {
    canAccess,
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasFeature,
    isAuthenticated,
    currentRole,
  };
}
