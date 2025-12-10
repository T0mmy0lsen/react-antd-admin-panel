import React from 'react';
import { useMain, useUser } from './MainContext';
import type { RouteConfig } from './types';

interface ProtectedRouteProps {
  route: RouteConfig;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * ProtectedRoute - Wraps a route component with access control
 * Redirects to auth route or shows fallback if user doesn't have access
 */
export function ProtectedRoute({ 
  route, 
  children, 
  fallback 
}: ProtectedRouteProps): React.ReactElement | null {
  const main = useMain();
  const user = useUser();

  // Check if user is authenticated
  if (!user) {
    if (main.config.authRoute) {
      main.navigate(main.config.authRoute);
    }
    return fallback ? React.createElement(React.Fragment, {}, fallback) : null;
  }

  // Check access
  if (!main.canAccess(route)) {
    return fallback 
      ? React.createElement(React.Fragment, {}, fallback)
      : React.createElement('div', {
          style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            flexDirection: 'column',
            gap: 16,
          },
        },
          React.createElement('h2', {}, 'Access Denied'),
          React.createElement('p', {}, 'You do not have permission to access this page.'),
        );
  }

  return React.createElement(React.Fragment, {}, children);
}

interface ProtectedProps {
  /** Required role to view children */
  role?: string;
  /** Required permission to view children */
  permission?: string;
  /** Required permissions (all) to view children */
  permissions?: string[];
  /** Required permissions (any) to view children */
  anyPermission?: string[];
  /** Fallback content when access denied */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Protected - Component-level access control
 * Shows children only if user has required role/permissions
 * 
 * @example
 * <Protected role="admin">
 *   <Button onClick={deleteUser}>Delete</Button>
 * </Protected>
 * 
 * @example
 * <Protected permission="users.edit" fallback={<span>No access</span>}>
 *   <EditUserForm />
 * </Protected>
 */
export function Protected({ 
  role, 
  permission, 
  permissions, 
  anyPermission,
  fallback,
  children,
}: ProtectedProps): React.ReactElement | null {
  const main = useMain();
  const userState = main.User();

  // Check role
  if (role && !userState.hasRole(role)) {
    return fallback ? React.createElement(React.Fragment, {}, fallback) : null;
  }

  // Check single permission
  if (permission && !userState.hasPermission(permission)) {
    return fallback ? React.createElement(React.Fragment, {}, fallback) : null;
  }

  // Check all permissions
  if (permissions && !userState.hasAllPermissions(permissions)) {
    return fallback ? React.createElement(React.Fragment, {}, fallback) : null;
  }

  // Check any permission
  if (anyPermission && !userState.hasAnyPermission(anyPermission)) {
    return fallback ? React.createElement(React.Fragment, {}, fallback) : null;
  }

  return React.createElement(React.Fragment, {}, children);
}
