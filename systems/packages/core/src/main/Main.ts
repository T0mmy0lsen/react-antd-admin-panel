import type { MainConfig, RouteConfig, MainInstance } from './types';
import { GlobalStore } from './Store';
import { UserState } from './UserState';

/**
 * Main - Central Application Orchestrator
 * Manages configuration, routing, and global state
 * 
 * @example
 * const app = new Main({
 *   config: {
 *     pathToApi: 'https://api.example.com',
 *     defaultRoute: '/dashboard',
 *     boot: async (main) => {
 *       const user = await fetchUser();
 *       main.User().set(user);
 *     },
 *   },
 *   sections: {
 *     '/dashboard': {
 *       component: DashboardPage,
 *       icon: <DashboardOutlined />,
 *       title: 'Dashboard',
 *     },
 *     '/users': {
 *       component: UsersPage,
 *       icon: <UserOutlined />,
 *       title: 'Users',
 *       requiredRole: 'admin',
 *     },
 *   },
 * });
 */
export class Main {
  private _config: MainConfig;
  private _store: GlobalStore;
  private _userState: UserState;
  private _navigate?: (path: string) => void;

  constructor(config: MainConfig) {
    this._config = config;
    this._store = new GlobalStore();
    this._userState = new UserState();
  }

  /**
   * Get the configuration
   */
  getConfig(): MainConfig {
    return this._config;
  }

  /**
   * Get route sections
   */
  getSections(): Record<string, RouteConfig> {
    return this._config.sections;
  }

  /**
   * Get a specific section/route config
   */
  getSection(path: string): RouteConfig | undefined {
    return this._config.sections[path];
  }

  /**
   * Get the global store
   */
  Store(): GlobalStore {
    return this._store;
  }

  /**
   * Get the user state manager
   */
  User(): UserState {
    return this._userState;
  }

  /**
   * Set the navigation function (called by MainProvider)
   */
  setNavigate(fn: (path: string) => void): void {
    this._navigate = fn;
  }

  /**
   * Navigate to a route
   */
  navigate(path: string): void {
    if (this._navigate) {
      this._navigate(path);
    } else {
      console.warn('Main: navigate called before setNavigate');
    }
  }

  /**
   * Check if the current user can access a route
   */
  canAccess(route: RouteConfig): boolean {
    // Check required role
    if (route.requiredRole && !this._userState.hasRole(route.requiredRole)) {
      return false;
    }

    // Check required permissions
    if (route.requiredPermissions && !this._userState.hasAllPermissions(route.requiredPermissions)) {
      return false;
    }

    return true;
  }

  /**
   * Get all accessible routes for the current user
   */
  getAccessibleRoutes(): Record<string, RouteConfig> {
    const accessible: Record<string, RouteConfig> = {};

    for (const [path, route] of Object.entries(this._config.sections)) {
      if (this.canAccess(route)) {
        accessible[path] = route;
      }
    }

    return accessible;
  }

  /**
   * Get routes for sidebar (non-hidden, accessible)
   */
  getSidebarRoutes(): Array<{ path: string; route: RouteConfig }> {
    return Object.entries(this._config.sections)
      .filter(([_, route]) => !route.hidden && this.canAccess(route))
      .map(([path, route]) => ({ path, route }));
  }

  /**
   * Create a MainInstance for use in context
   */
  createInstance(navigate: (path: string) => void): MainInstance {
    this.setNavigate(navigate);
    
    return {
      User: () => this._userState,
      Store: () => this._store,
      config: this._config.config,
      navigate: (path: string) => this.navigate(path),
      canAccess: (route: RouteConfig) => this.canAccess(route),
    };
  }

  /**
   * Get the default route
   */
  getDefaultRoute(): string {
    return this._config.config.defaultRoute || '/';
  }

  /**
   * Get the auth route (for unauthenticated users)
   */
  getAuthRoute(): string {
    return this._config.config.authRoute || '/login';
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this._userState.isAuthenticated();
  }

  /**
   * Flatten nested routes for routing
   */
  getFlatRoutes(): Array<{ path: string; route: RouteConfig }> {
    const routes: Array<{ path: string; route: RouteConfig }> = [];

    const flatten = (sections: Record<string, RouteConfig>, prefix = '') => {
      for (const [path, route] of Object.entries(sections)) {
        const fullPath = prefix + path;
        routes.push({ path: fullPath, route });

        if (route.children) {
          flatten(route.children, fullPath);
        }
      }
    };

    flatten(this._config.sections);
    return routes;
  }
}
