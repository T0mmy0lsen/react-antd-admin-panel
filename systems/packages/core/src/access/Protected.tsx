import React, { ReactNode } from 'react';
import { useAccess } from '../hooks/useAccess';

/**
 * Props for the AccessGuard component
 */
export interface AccessGuardProps {
  /** Children to render when access is granted */
  children: ReactNode;
  /** Fallback content when access is denied (optional) */
  fallback?: ReactNode;
  /** Single role to check */
  role?: string;
  /** Multiple roles to check (user needs any one) */
  roles?: string[];
  /** Single permission to check */
  permission?: string;
  /** Multiple permissions to check (user needs all) */
  permissions?: string[];
  /** Feature name for feature-based access */
  feature?: string;
  /** Required access level for feature (default: 1) */
  level?: number;
  /** Whether user must be authenticated (default: true when using any check) */
  requireAuth?: boolean;
}

/**
 * AccessGuard - Component for conditional rendering based on access control
 * 
 * Wraps children and only renders them if the user has the required
 * role, permission, or feature access level.
 * 
 * @example
 * ```tsx
 * // Role-based protection
 * <Protected role="admin">
 *   <DeleteButton />
 * </Protected>
 * 
 * // Permission-based protection
 * <Protected permission="users.delete">
 *   <DeleteButton />
 * </Protected>
 * 
 * // Feature with level
 * <Protected feature="Users" level={3}>
 *   <DeleteButton />
 * </Protected>
 * 
 * // Multiple roles (any match)
 * <Protected roles={['admin', 'manager']}>
 *   <ManagePanel />
 * </Protected>
 * 
 * // With fallback content
 * <Protected role="admin" fallback={<span>Admin only</span>}>
 *   <AdminPanel />
 * </Protected>
 * 
 * // Multiple permissions (all required)
 * <Protected permissions={['users.read', 'users.write']}>
 *   <EditForm />
 * </Protected>
 * ```
 */
export function AccessGuard({
  children,
  fallback = null,
  role,
  roles,
  permission,
  permissions,
  feature,
  level = 1,
  requireAuth,
}: AccessGuardProps): React.ReactElement | null {
  const access = useAccess();

  // Determine if auth is required
  const needsAuth = requireAuth ?? (
    role !== undefined ||
    roles !== undefined ||
    permission !== undefined ||
    permissions !== undefined ||
    feature !== undefined
  );

  // Check authentication first
  if (needsAuth && !access.isAuthenticated) {
    return fallback as React.ReactElement | null;
  }

  // Check single role
  if (role !== undefined && !access.hasRole(role)) {
    return fallback as React.ReactElement | null;
  }

  // Check multiple roles (any match)
  if (roles !== undefined && !access.hasAnyRole(roles)) {
    return fallback as React.ReactElement | null;
  }

  // Check single permission
  if (permission !== undefined && !access.hasPermission(permission)) {
    return fallback as React.ReactElement | null;
  }

  // Check multiple permissions (all required)
  if (permissions !== undefined && !access.hasAllPermissions(permissions)) {
    return fallback as React.ReactElement | null;
  }

  // Check feature access
  if (feature !== undefined && !access.hasFeature(feature, level)) {
    return fallback as React.ReactElement | null;
  }

  // All checks passed, render children
  return <>{children}</>;
}

export default AccessGuard;