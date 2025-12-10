import { useState, useEffect, useCallback, useRef } from 'react';
import { Get } from '../http/Get';

/**
 * Options for the useGet hook
 */
export interface UseGetOptions<T> {
  /** The URL to fetch */
  url: string;
  /** Query parameters */
  params?: Record<string, any>;
  /** Request headers */
  headers?: Record<string, string>;
  /** Execute immediately on mount (default: true) */
  immediate?: boolean;
  /** Enable/disable the request (default: true) */
  enabled?: boolean;
  /** Callback on success */
  onSuccess?: (data: T) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

/**
 * Return type for the useGet hook
 */
export interface UseGetResult<T> {
  /** The fetched data */
  data: T | undefined;
  /** Loading state */
  loading: boolean;
  /** Error if request failed */
  error: Error | undefined;
  /** Execute/re-execute the request */
  execute: (overrideParams?: Record<string, any>) => Promise<T | undefined>;
  /** Abort the current request */
  abort: () => void;
  /** Reset state to initial values */
  reset: () => void;
}

/**
 * useGet - React hook for GET requests
 * 
 * @template T - Response data type
 * @param options - Hook options
 * @returns Hook result with data, loading, error, and control functions
 * 
 * @example
 * ```tsx
 * // Basic usage - fetches immediately
 * const { data, loading, error } = useGet<User[]>({
 *   url: '/api/users',
 * });
 * 
 * // With parameters
 * const { data, loading } = useGet<User[]>({
 *   url: '/api/users',
 *   params: { page: 1, limit: 10 },
 * });
 * 
 * // Manual execution
 * const { data, execute, loading } = useGet<User>({
 *   url: '/api/users/1',
 *   immediate: false,
 * });
 * // Later: await execute();
 * 
 * // Conditional fetch
 * const { data } = useGet<User>({
 *   url: `/api/users/${userId}`,
 *   enabled: !!userId,
 * });
 * ```
 */
export function useGet<T = any>(options: UseGetOptions<T>): UseGetResult<T> {
  const { 
    url, 
    params, 
    immediate = true, 
    enabled = true,
  } = options;

  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(immediate && enabled);
  const [error, setError] = useState<Error | undefined>(undefined);
  
  // Use ref to track the current Get instance for cancellation
  const getInstanceRef = useRef<Get<T> | null>(null);
  // Track if component is mounted to prevent state updates after unmount
  const mountedRef = useRef<boolean>(true);
  // Track the latest options to avoid stale closures
  const optionsRef = useRef(options);
  optionsRef.current = options;

  /**
   * Execute the GET request
   */
  const execute = useCallback(async (overrideParams?: Record<string, any>): Promise<T | undefined> => {
    // Cancel any pending request
    if (getInstanceRef.current) {
      getInstanceRef.current.cancel();
    }

    const currentOptions = optionsRef.current;
    
    // Create new Get instance
    const get = new Get<T>()
      .target(currentOptions.url)
      .params({ ...currentOptions.params, ...overrideParams });

    if (currentOptions.headers) {
      get.headers(currentOptions.headers);
    }

    getInstanceRef.current = get;

    if (mountedRef.current) {
      setLoading(true);
      setError(undefined);
    }

    try {
      const result = await get.execute();
      
      if (mountedRef.current) {
        setData(result);
        setLoading(false);
        currentOptions.onSuccess?.(result);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      
      // Don't update state if request was aborted
      if (error.name === 'CanceledError' || error.name === 'AbortError') {
        return undefined;
      }
      
      if (mountedRef.current) {
        setError(error);
        setLoading(false);
        currentOptions.onError?.(error);
      }
      
      return undefined;
    }
  }, []);

  /**
   * Abort the current request
   */
  const abort = useCallback(() => {
    if (getInstanceRef.current) {
      getInstanceRef.current.cancel();
      getInstanceRef.current = null;
    }
    if (mountedRef.current) {
      setLoading(false);
    }
  }, []);

  /**
   * Reset state to initial values
   */
  const reset = useCallback(() => {
    abort();
    if (mountedRef.current) {
      setData(undefined);
      setError(undefined);
      setLoading(false);
    }
  }, [abort]);

  // Execute on mount if immediate and enabled
  useEffect(() => {
    if (immediate && enabled) {
      execute();
    }
  }, [url, immediate, enabled, execute]);

  // Re-execute when params change (if immediate and enabled)
  useEffect(() => {
    // Skip the initial mount - handled above
    // This effect handles param changes after mount
  }, [params]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      if (getInstanceRef.current) {
        getInstanceRef.current.cancel();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    abort,
    reset,
  };
}
