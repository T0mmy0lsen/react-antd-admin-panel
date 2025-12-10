import type { GlobalStore } from './Store';
import type { UserState } from './UserState';

/**
 * Route/Section configuration for the Main orchestrator
 */
export interface RouteConfig {
  /** The React component to render */
  component: React.ComponentType<any>;
  /** Icon for sidebar/menu */
  icon?: React.ReactNode;
  /** Display title */
  title: string;
  /** Whether to hide from sidebar */
  hidden?: boolean;
  /** Required role to access */
  requiredRole?: string;
  /** Required permissions to access */
  requiredPermissions?: string[];
  /** Child routes (nested) */
  children?: Record<string, RouteConfig>;
  /** Redirect to another route */
  redirect?: string;
  /** Layout to use (default: 'default') */
  layout?: 'default' | 'blank' | 'auth';
}

/**
 * HTTP configuration for global API settings
 * Named MainHttpConfig to avoid conflict with base HttpConfig
 */
export interface MainHttpConfig {
  /** Base URL for all API requests */
  baseURL?: string;
  /** Default request timeout in ms */
  timeout?: number;
  /** Default headers for all requests */
  headers?: Record<string, string>;
  /** Request interceptor */
  onRequest?: (config: any) => any | Promise<any>;
  /** Response interceptor */
  onResponse?: (response: any) => any;
  /** Error interceptor */
  onError?: (error: any) => any;
  /** Called when a 401 is received */
  onUnauthorized?: () => void;
}

/**
 * Profile menu configuration
 */
export interface ProfileMenuConfig {
  /** Show avatar in menu */
  showAvatar?: boolean;
  /** Avatar field key (default: 'avatar') */
  avatarKey?: string;
  /** Name field key (default: 'name') */
  nameKey?: string;
  /** Email field key (default: 'email') */
  emailKey?: string;
  /** Extra menu items */
  extraItems?: Array<{
    key: string;
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    danger?: boolean;
    divider?: boolean;
  }>;
  /** Called when logout is clicked */
  onLogout?: () => void | Promise<void>;
  /** Whether to show logout button */
  showLogout?: boolean;
}

/**
 * Sidebar configuration
 */
export interface SidebarConfig {
  /** Logo component or URL */
  logo?: React.ReactNode | string;
  /** Collapsed logo */
  collapsedLogo?: React.ReactNode | string;
  /** Title shown next to logo */
  title?: string;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
  /** Theme */
  theme?: 'light' | 'dark';
  /** Width when expanded */
  width?: number;
  /** Width when collapsed */
  collapsedWidth?: number;
  /** Footer content */
  footer?: React.ReactNode;
}

/**
 * Main orchestrator configuration
 */
export interface MainConfig {
  /** Application configuration */
  config: {
    /** Base URL for API requests */
    pathToApi?: string;
    /** Default route after login */
    defaultRoute?: string;
    /** Route for unauthenticated users */
    authRoute?: string;
    /** Boot function called on app start */
    boot?: (main: MainInstance) => void | Promise<void>;
    /** HTTP configuration */
    http?: MainHttpConfig;
    /** Profile menu configuration */
    profileMenu?: ProfileMenuConfig;
    /** Sidebar configuration */
    sidebar?: SidebarConfig;
  };
  /** Route sections */
  sections: Record<string, RouteConfig>;
}

/**
 * Main instance interface (passed to boot and elsewhere)
 */
export interface MainInstance {
  /** User state manager */
  User: () => UserState;
  /** Global store */
  Store: () => GlobalStore;
  /** Configuration */
  config: MainConfig['config'];
  /** Navigate to a route */
  navigate: (path: string) => void;
  /** Check if user can access a route */
  canAccess: (route: RouteConfig) => boolean;
}
