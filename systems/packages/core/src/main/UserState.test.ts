import { describe, it, expect, vi } from 'vitest';
import { UserState } from './UserState';

describe('UserState', () => {
  it('should create an instance', () => {
    const userState = new UserState();
    expect(userState).toBeDefined();
  });

  describe('get/set', () => {
    it('should set and get user', () => {
      const userState = new UserState();
      const user = { id: 1, name: 'John', email: 'john@example.com' };
      userState.set(user);
      expect(userState.get()).toEqual(user);
    });

    it('should return null when no user', () => {
      const userState = new UserState();
      expect(userState.get()).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user properties', () => {
      const userState = new UserState();
      userState.set({ id: 1, name: 'John' });
      userState.update({ name: 'Jane' });
      expect(userState.get()?.name).toBe('Jane');
    });

    it('should not update when no user', () => {
      const userState = new UserState();
      userState.update({ name: 'Jane' });
      expect(userState.get()).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear user', () => {
      const userState = new UserState();
      userState.set({ id: 1, name: 'John' });
      userState.clear();
      expect(userState.get()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user exists', () => {
      const userState = new UserState();
      userState.set({ id: 1, name: 'John' });
      expect(userState.isAuthenticated()).toBe(true);
    });

    it('should return false when no user', () => {
      const userState = new UserState();
      expect(userState.isAuthenticated()).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return true for matching role', () => {
      const userState = new UserState();
      userState.set({ id: 1, name: 'John', role: 'admin' });
      expect(userState.hasRole('admin')).toBe(true);
    });

    it('should return false for non-matching role', () => {
      const userState = new UserState();
      userState.set({ id: 1, name: 'John', role: 'user' });
      expect(userState.hasRole('admin')).toBe(false);
    });
  });

  describe('hasAnyRole', () => {
    it('should return true if user has any of the roles', () => {
      const userState = new UserState();
      userState.set({ id: 1, name: 'John', role: 'editor' });
      expect(userState.hasAnyRole(['admin', 'editor'])).toBe(true);
    });

    it('should return false if user has none of the roles', () => {
      const userState = new UserState();
      userState.set({ id: 1, name: 'John', role: 'user' });
      expect(userState.hasAnyRole(['admin', 'editor'])).toBe(false);
    });
  });

  describe('hasPermission', () => {
    it('should return true for existing permission', () => {
      const userState = new UserState();
      userState.set({ id: 1, name: 'John', permissions: ['users.read', 'users.write'] });
      expect(userState.hasPermission('users.read')).toBe(true);
    });

    it('should return false for missing permission', () => {
      const userState = new UserState();
      userState.set({ id: 1, name: 'John', permissions: ['users.read'] });
      expect(userState.hasPermission('users.delete')).toBe(false);
    });

    it('should return false when no permissions', () => {
      const userState = new UserState();
      userState.set({ id: 1, name: 'John' });
      expect(userState.hasPermission('users.read')).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('should return true when user has all permissions', () => {
      const userState = new UserState();
      userState.set({ id: 1, permissions: ['a', 'b', 'c'] });
      expect(userState.hasAllPermissions(['a', 'b'])).toBe(true);
    });

    it('should return false when user is missing permissions', () => {
      const userState = new UserState();
      userState.set({ id: 1, permissions: ['a'] });
      expect(userState.hasAllPermissions(['a', 'b'])).toBe(false);
    });
  });

  describe('hasAnyPermission', () => {
    it('should return true when user has any permission', () => {
      const userState = new UserState();
      userState.set({ id: 1, permissions: ['a'] });
      expect(userState.hasAnyPermission(['a', 'b'])).toBe(true);
    });

    it('should return false when user has none of the permissions', () => {
      const userState = new UserState();
      userState.set({ id: 1, permissions: ['c'] });
      expect(userState.hasAnyPermission(['a', 'b'])).toBe(false);
    });
  });

  describe('getProperty', () => {
    it('should return user property', () => {
      const userState = new UserState();
      userState.set({ id: 1, name: 'John', email: 'john@example.com' });
      expect(userState.getProperty('name')).toBe('John');
      expect(userState.getProperty('email')).toBe('john@example.com');
    });

    it('should return undefined for missing property', () => {
      const userState = new UserState();
      userState.set({ id: 1 });
      expect(userState.getProperty('name')).toBeUndefined();
    });
  });

  describe('subscribe', () => {
    it('should notify subscriber on set', () => {
      const userState = new UserState();
      const callback = vi.fn();
      userState.subscribe(callback);
      const user = { id: 1, name: 'John' };
      userState.set(user);
      expect(callback).toHaveBeenCalledWith(user);
    });

    it('should notify subscriber on clear', () => {
      const userState = new UserState();
      const callback = vi.fn();
      userState.set({ id: 1, name: 'John' });
      userState.subscribe(callback);
      userState.clear();
      expect(callback).toHaveBeenCalledWith(null);
    });

    it('should unsubscribe correctly', () => {
      const userState = new UserState();
      const callback = vi.fn();
      const unsubscribe = userState.subscribe(callback);
      unsubscribe();
      userState.set({ id: 1, name: 'John' });
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
