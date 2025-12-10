/**
 * Core type definitions for react-antd-admin-panel v2
 */

/**
 * Base Builder interface that all component builders must implement
 */
export interface Builder<T = any> {
  /**
   * Set a unique key for the component
   */
  key(k: keyof T & string): this;
  
  /**
   * Render the component to React node
   */
  render(): React.ReactNode;
}

/**
 * Deep partial type utility for nested objects
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * Extract keys of a specific type from an object
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/**
 * Make specific properties required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Component configuration base
 */
export interface ComponentConfig {
  key?: string;
  disabled?: boolean;
  hidden?: boolean;
}

// Re-export all type modules
export * from './lifecycle';
export * from './http';
export * from './form';
export * from './list';
export * from './state';
