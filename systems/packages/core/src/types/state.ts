/**
 * State management types
 */

export type StateUpdater<T> = (prevState: T) => T;
export type SetState<T> = (value: T | StateUpdater<T>) => void;

export interface StateHooks<T = any> {
  onChange?: (value: T, prevValue: T) => void;
  onError?: (error: Error) => void;
}

export interface Store {
  get<T = any>(key: string): T | undefined;
  set<T = any>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
  subscribe<T = any>(key: string, callback: (value: T) => void): () => void;
}

export interface User {
  id: string | number;
  name?: string;
  email?: string;
  role?: string;
  permissions?: string[];
  /** Feature access levels: feature name -> access level (higher = more access) */
  features?: Record<string, number>;
  [key: string]: any;
}
