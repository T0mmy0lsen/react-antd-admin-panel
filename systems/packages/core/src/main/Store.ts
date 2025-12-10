import type { Store as IStore, StateUpdater } from '../types';

type Subscriber<T = any> = (value: T) => void;

/**
 * Global Store - Reactive key-value store for application state
 * Supports subscriptions for reactive updates
 * 
 * @example
 * const store = new GlobalStore();
 * store.set('theme', 'dark');
 * store.subscribe('theme', (theme) => console.log('Theme changed:', theme));
 * store.get<string>('theme'); // 'dark'
 */
export class GlobalStore implements IStore {
  private _data: Map<string, any> = new Map();
  private _subscribers: Map<string, Set<Subscriber>> = new Map();

  /**
   * Get a value from the store
   */
  get<T = any>(key: string): T | undefined {
    return this._data.get(key);
  }

  /**
   * Set a value in the store
   * Notifies all subscribers of the change
   */
  set<T = any>(key: string, value: T | StateUpdater<T>): void {
    const prevValue = this._data.get(key);
    const newValue = typeof value === 'function' 
      ? (value as StateUpdater<T>)(prevValue)
      : value;
    
    this._data.set(key, newValue);
    this._notifySubscribers(key, newValue);
  }

  /**
   * Remove a value from the store
   */
  remove(key: string): void {
    this._data.delete(key);
    this._notifySubscribers(key, undefined);
  }

  /**
   * Clear all values from the store
   */
  clear(): void {
    const keys = Array.from(this._data.keys());
    this._data.clear();
    keys.forEach(key => this._notifySubscribers(key, undefined));
  }

  /**
   * Check if a key exists in the store
   */
  has(key: string): boolean {
    return this._data.has(key);
  }

  /**
   * Get all keys in the store
   */
  keys(): string[] {
    return Array.from(this._data.keys());
  }

  /**
   * Subscribe to changes for a specific key
   * Returns an unsubscribe function
   */
  subscribe<T = any>(key: string, callback: Subscriber<T>): () => void {
    if (!this._subscribers.has(key)) {
      this._subscribers.set(key, new Set());
    }
    this._subscribers.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      const subscribers = this._subscribers.get(key);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          this._subscribers.delete(key);
        }
      }
    };
  }

  /**
   * Notify all subscribers of a value change
   */
  private _notifySubscribers(key: string, value: any): void {
    const subscribers = this._subscribers.get(key);
    if (subscribers) {
      subscribers.forEach(callback => callback(value));
    }
  }

  /**
   * Get the store as a plain object
   */
  toObject(): Record<string, any> {
    return Object.fromEntries(this._data);
  }
}
