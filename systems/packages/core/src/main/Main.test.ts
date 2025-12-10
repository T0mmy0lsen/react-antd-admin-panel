import { describe, it, expect, vi } from 'vitest';
import { Main } from './Main';
import type { MainConfig, RouteConfig } from './types';

// Mock component for routes
const MockComponent = () => null;

const createTestConfig = (): MainConfig => ({
  config: {
    pathToApi: 'https://api.example.com',
    defaultRoute: '/dashboard',
    authRoute: '/login',
  },
  sections: {
    '/dashboard': {
      component: MockComponent,
      title: 'Dashboard',
    },
    '/users': {
      component: MockComponent,
      title: 'Users',
      requiredRole: 'admin',
    },
    '/settings': {
      component: MockComponent,
      title: 'Settings',
      hidden: true,
    },
    '/reports': {
      component: MockComponent,
      title: 'Reports',
      requiredPermissions: ['reports.view'],
    },
  },
});

describe('Main', () => {
  it('should create an instance', () => {
    const main = new Main(createTestConfig());
    expect(main).toBeDefined();
  });

  describe('getConfig', () => {
    it('should return the configuration', () => {
      const config = createTestConfig();
      const main = new Main(config);
      expect(main.getConfig()).toEqual(config);
    });
  });

  describe('getSections', () => {
    it('should return all sections', () => {
      const config = createTestConfig();
      const main = new Main(config);
      expect(Object.keys(main.getSections())).toHaveLength(4);
    });
  });

  describe('getSection', () => {
    it('should return a specific section', () => {
      const main = new Main(createTestConfig());
      const section = main.getSection('/dashboard');
      expect(section?.title).toBe('Dashboard');
    });

    it('should return undefined for non-existent section', () => {
      const main = new Main(createTestConfig());
      expect(main.getSection('/nonexistent')).toBeUndefined();
    });
  });

  describe('Store', () => {
    it('should return GlobalStore instance', () => {
      const main = new Main(createTestConfig());
      const store = main.Store();
      expect(store).toBeDefined();
      expect(typeof store.get).toBe('function');
      expect(typeof store.set).toBe('function');
    });

    it('should return same store instance', () => {
      const main = new Main(createTestConfig());
      expect(main.Store()).toBe(main.Store());
    });
  });

  describe('User', () => {
    it('should return UserState instance', () => {
      const main = new Main(createTestConfig());
      const userState = main.User();
      expect(userState).toBeDefined();
      expect(typeof userState.get).toBe('function');
      expect(typeof userState.set).toBe('function');
    });

    it('should return same userState instance', () => {
      const main = new Main(createTestConfig());
      expect(main.User()).toBe(main.User());
    });
  });

  describe('navigate', () => {
    it('should call navigate function when set', () => {
      const main = new Main(createTestConfig());
      const navigateFn = vi.fn();
      main.setNavigate(navigateFn);
      main.navigate('/users');
      expect(navigateFn).toHaveBeenCalledWith('/users');
    });

    it('should warn when navigate called before setNavigate', () => {
      const main = new Main(createTestConfig());
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      main.navigate('/users');
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });

  describe('canAccess', () => {
    it('should return true for routes without requirements', () => {
      const main = new Main(createTestConfig());
      const route: RouteConfig = { component: MockComponent, title: 'Test' };
      expect(main.canAccess(route)).toBe(true);
    });

    it('should return false for role-protected route without matching role', () => {
      const main = new Main(createTestConfig());
      main.User().set({ id: 1, role: 'user' });
      const route: RouteConfig = { component: MockComponent, title: 'Admin', requiredRole: 'admin' };
      expect(main.canAccess(route)).toBe(false);
    });

    it('should return true for role-protected route with matching role', () => {
      const main = new Main(createTestConfig());
      main.User().set({ id: 1, role: 'admin' });
      const route: RouteConfig = { component: MockComponent, title: 'Admin', requiredRole: 'admin' };
      expect(main.canAccess(route)).toBe(true);
    });

    it('should return false for permission-protected route without permissions', () => {
      const main = new Main(createTestConfig());
      main.User().set({ id: 1, permissions: [] });
      const route: RouteConfig = { component: MockComponent, title: 'Reports', requiredPermissions: ['reports.view'] };
      expect(main.canAccess(route)).toBe(false);
    });

    it('should return true for permission-protected route with permissions', () => {
      const main = new Main(createTestConfig());
      main.User().set({ id: 1, permissions: ['reports.view', 'reports.edit'] });
      const route: RouteConfig = { component: MockComponent, title: 'Reports', requiredPermissions: ['reports.view'] };
      expect(main.canAccess(route)).toBe(true);
    });
  });

  describe('getAccessibleRoutes', () => {
    it('should return only accessible routes', () => {
      const main = new Main(createTestConfig());
      main.User().set({ id: 1, role: 'admin', permissions: ['reports.view'] });
      const accessible = main.getAccessibleRoutes();
      expect(Object.keys(accessible)).toContain('/dashboard');
      expect(Object.keys(accessible)).toContain('/users');
      expect(Object.keys(accessible)).toContain('/reports');
    });

    it('should filter routes based on role', () => {
      const main = new Main(createTestConfig());
      main.User().set({ id: 1, role: 'user', permissions: ['reports.view'] });
      const accessible = main.getAccessibleRoutes();
      expect(Object.keys(accessible)).not.toContain('/users');
    });
  });

  describe('getSidebarRoutes', () => {
    it('should return non-hidden accessible routes', () => {
      const main = new Main(createTestConfig());
      main.User().set({ id: 1, role: 'admin', permissions: ['reports.view'] });
      const sidebarRoutes = main.getSidebarRoutes();
      const paths = sidebarRoutes.map(r => r.path);
      expect(paths).toContain('/dashboard');
      expect(paths).not.toContain('/settings'); // hidden
    });
  });

  describe('getDefaultRoute', () => {
    it('should return configured default route', () => {
      const main = new Main(createTestConfig());
      expect(main.getDefaultRoute()).toBe('/dashboard');
    });

    it('should return / when no default route configured', () => {
      const main = new Main({ config: {}, sections: {} });
      expect(main.getDefaultRoute()).toBe('/');
    });
  });

  describe('getAuthRoute', () => {
    it('should return configured auth route', () => {
      const main = new Main(createTestConfig());
      expect(main.getAuthRoute()).toBe('/login');
    });

    it('should return /login when no auth route configured', () => {
      const main = new Main({ config: {}, sections: {} });
      expect(main.getAuthRoute()).toBe('/login');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is set', () => {
      const main = new Main(createTestConfig());
      main.User().set({ id: 1, name: 'John' });
      expect(main.isAuthenticated()).toBe(true);
    });

    it('should return false when no user', () => {
      const main = new Main(createTestConfig());
      expect(main.isAuthenticated()).toBe(false);
    });
  });

  describe('getFlatRoutes', () => {
    it('should flatten nested routes', () => {
      const config: MainConfig = {
        config: {},
        sections: {
          '/users': {
            component: MockComponent,
            title: 'Users',
            children: {
              '/list': { component: MockComponent, title: 'List' },
              '/create': { component: MockComponent, title: 'Create' },
            },
          },
        },
      };
      const main = new Main(config);
      const flatRoutes = main.getFlatRoutes();
      const paths = flatRoutes.map(r => r.path);
      expect(paths).toContain('/users');
      expect(paths).toContain('/users/list');
      expect(paths).toContain('/users/create');
    });
  });

  describe('createInstance', () => {
    it('should create MainInstance with all methods', () => {
      const main = new Main(createTestConfig());
      const navigateFn = vi.fn();
      const instance = main.createInstance(navigateFn);
      
      expect(typeof instance.User).toBe('function');
      expect(typeof instance.Store).toBe('function');
      expect(typeof instance.navigate).toBe('function');
      expect(typeof instance.canAccess).toBe('function');
      expect(instance.config).toBeDefined();
    });

    it('should navigate through instance', () => {
      const main = new Main(createTestConfig());
      const navigateFn = vi.fn();
      const instance = main.createInstance(navigateFn);
      instance.navigate('/dashboard');
      expect(navigateFn).toHaveBeenCalledWith('/dashboard');
    });
  });
});
