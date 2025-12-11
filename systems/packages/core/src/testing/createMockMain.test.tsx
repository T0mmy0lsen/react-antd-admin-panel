import { describe, it, expect } from 'vitest';
import { createMockMain } from './createMockMain';

describe('createMockMain', () => {
  it('should create a mock main result with all required properties', () => {
    const result = createMockMain();
    
    expect(result.wrapper).toBeDefined();
    expect(typeof result.wrapper).toBe('function');
    expect(result.mockNavigate).toBeDefined();
    expect(result.mockHttp).toBeDefined();
    expect(result.mainInstance).toBeDefined();
    expect(result.userState).toBeDefined();
    expect(result.store).toBeDefined();
  });

  it('should initialize with provided user', () => {
    const { userState } = createMockMain({
      user: { id: '1', name: 'Test User', role: 'admin' },
    });

    const user = userState.get();
    expect(user?.id).toBe('1');
    expect(user?.name).toBe('Test User');
    expect(user?.role).toBe('admin');
  });

  it('should initialize with provided store values', () => {
    const { store } = createMockMain({
      store: { theme: 'dark', locale: 'en' },
    });

    expect(store.get('theme')).toBe('dark');
    expect(store.get('locale')).toBe('en');
  });

  it('should track navigate calls', () => {
    const { mockNavigate } = createMockMain();

    mockNavigate('/users');
    mockNavigate('/settings');

    expect(mockNavigate.mock.calls).toHaveLength(2);
    expect(mockNavigate.mock.calls[0]).toEqual(['/users']);
    expect(mockNavigate.mock.calls[1]).toEqual(['/settings']);
  });

  it('should clear navigate calls', () => {
    const { mockNavigate } = createMockMain();

    mockNavigate('/test');
    expect(mockNavigate.mock.calls).toHaveLength(1);

    mockNavigate.mockClear();
    expect(mockNavigate.mock.calls).toHaveLength(0);
  });

  it('should provide mainInstance with config', () => {
    const { mainInstance } = createMockMain({
      config: { pathToApi: '/custom-api' },
    });

    expect(mainInstance.config.pathToApi).toBe('/custom-api');
  });

  it('should check access based on user role', () => {
    const { mainInstance, userState } = createMockMain({
      user: { id: '1', role: 'admin' },
    });

    const adminRoute = { component: () => null, title: 'Admin', requiredRole: 'admin' };
    const superRoute = { component: () => null, title: 'Super', requiredRole: 'superadmin' };

    expect(mainInstance.canAccess(adminRoute)).toBe(true);
    expect(mainInstance.canAccess(superRoute)).toBe(false);
  });

  it('should check access based on permissions', () => {
    const { mainInstance } = createMockMain({
      user: { id: '1', permissions: ['read', 'write'] },
    });

    const readRoute = { component: () => null, title: 'Read', requiredPermissions: ['read'] };
    const deleteRoute = { component: () => null, title: 'Delete', requiredPermissions: ['delete'] };

    expect(mainInstance.canAccess(readRoute)).toBe(true);
    expect(mainInstance.canAccess(deleteRoute)).toBe(false);
  });

  it('should provide working mockHttp', async () => {
    const { mockHttp } = createMockMain();

    mockHttp.onGet('/api/test', { data: { message: 'hello' } });

    const response = await mockHttp.get('/api/test');
    expect(response.data.message).toBe('hello');
  });

  it('should allow updating user state', () => {
    const { userState } = createMockMain();

    expect(userState.isAuthenticated()).toBe(false);

    userState.set({ id: '1', name: 'New User' });
    expect(userState.isAuthenticated()).toBe(true);
    expect(userState.get()?.name).toBe('New User');
  });
});
