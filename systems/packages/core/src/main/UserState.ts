import type { User } from '../types';

type UserSubscriber = (user: User | null) => void;

/**
 * UserState - Manages authenticated user state
 * Provides reactive user context with subscriptions
 * 
 * @example
 * const userState = new UserState();
 * userState.set({ id: 1, name: 'John', email: 'john@example.com', role: 'admin' });
 * userState.subscribe((user) => console.log('User changed:', user));
 * userState.hasPermission('users.create');
 */
export class UserState {
  private _user: User | null = null;
  private _subscribers: Set<UserSubscriber> = new Set();

  /**
   * Get the current user
   */
  get(): User | null {
    return this._user;
  }

  /**
   * Set the current user
   */
  set(user: User | null): void {
    this._user = user;
    this._notifySubscribers();
  }

  /**
   * Update user properties
   */
  update(updates: Partial<User>): void {
    if (this._user) {
      this._user = { ...this._user, ...updates };
      this._notifySubscribers();
    }
  }

  /**
   * Clear the current user (logout)
   */
  clear(): void {
    this._user = null;
    this._notifySubscribers();
  }

  /**
   * Check if a user is authenticated
   */
  isAuthenticated(): boolean {
    return this._user !== null;
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    return this._user?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.includes(this._user?.role ?? '');
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: string): boolean {
    return this._user?.permissions?.includes(permission) ?? false;
  }

  /**
   * Check if user has all specified permissions
   */
  hasAllPermissions(permissions: string[]): boolean {
    if (!this._user?.permissions) return false;
    return permissions.every(p => this._user!.permissions!.includes(p));
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissions: string[]): boolean {
    if (!this._user?.permissions) return false;
    return permissions.some(p => this._user!.permissions!.includes(p));
  }

  /**
   * Get a user property
   */
  getProperty<K extends keyof User>(key: K): User[K] | undefined {
    return this._user?.[key];
  }

  /**
   * Subscribe to user changes
   * Returns an unsubscribe function
   */
  subscribe(callback: UserSubscriber): () => void {
    this._subscribers.add(callback);
    return () => {
      this._subscribers.delete(callback);
    };
  }

  /**
   * Notify all subscribers
   */
  private _notifySubscribers(): void {
    this._subscribers.forEach(callback => callback(this._user));
  }
}
