/**
 * Component lifecycle hook types
 */

export type LifecycleHook<T = any> = (value: T) => void | Promise<void>;

export interface LifecycleHooks<T = any> {
  onMount?: LifecycleHook<T>;
  onUnmount?: LifecycleHook<T>;
  onChange?: LifecycleHook<T>;
  onValidate?: (value: T) => boolean | string | Promise<boolean | string>;
}

export interface FormLifecycleHooks<T = any> extends LifecycleHooks<T> {
  onSubmit?: LifecycleHook<T>;
  onSuccess?: LifecycleHook<T>;
  onError?: (error: Error) => void;
  onReset?: () => void;
}
