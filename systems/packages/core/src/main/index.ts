/**
 * Main Module - Central Application Orchestrator
 * 
 * Provides:
 * - Main class for app configuration
 * - UserState for authenticated user management
 * - GlobalStore for application state
 * - AppLayout for sidebar navigation
 * - ProfileMenu for user dropdown
 * - Protected components for access control
 * - React hooks for accessing Main context
 */

// Core classes
export { Main } from './Main';
export { GlobalStore } from './Store';
export { UserState } from './UserState';

// React components
export { MainProvider, MainContext, useMain, useUser, useStore, useStoreActions } from './MainContext';
export { AppLayout } from './AppLayout';
export { ProfileMenu } from './ProfileMenu';
export { ProtectedRoute, Protected } from './ProtectedRoute';

// Types
export type {
  MainConfig,
  MainInstance,
  RouteConfig,
  MainHttpConfig,
  ProfileMenuConfig,
  SidebarConfig,
} from './types';
