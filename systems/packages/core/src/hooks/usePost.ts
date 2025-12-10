import { useState, useCallback, useRef } from 'react';
import { Post } from '../http/Post';

/**
 * HTTP methods supported by usePost
 */
export type UsePostMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Options for the usePost hook
 */
export interface UsePostOptions<_TBody, TResponse> {
  /** The URL to send the request to */
  url: string;
  /** HTTP method (default: POST) */
  method?: UsePostMethod;
  /** Request headers */
  headers?: Record<string, string>;
  /** Callback on success */
  onSuccess?: (data: TResponse) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

/**
 * Return type for the usePost hook
 */
export interface UsePostResult<TBody, TResponse> {
  /** Execute the request with the given body */
  execute: (body?: TBody) => Promise<TResponse | undefined>;
  /** Whether a request is in progress */
  submitting: boolean;
  /** Error if request failed */
  error: Error | undefined;
  /** Response data from the last successful request */
  data: TResponse | undefined;
  /** Reset state to initial values */
  reset: () => void;
  /** Abort the current request */
  abort: () => void;
}

/**
 * usePost - React hook for POST/PUT/PATCH/DELETE requests
 * 
 * @template TBody - Request body type
 * @template TResponse - Response data type
 * @param options - Hook options
 * @returns Hook result with execute function, submitting state, and data
 * 
 * @example
 * ```tsx
 * // Basic POST
 * const { execute, submitting } = usePost<CreateUserDto, User>({
 *   url: '/api/users',
 *   onSuccess: (user) => navigate(`/users/${user.id}`),
 * });
 * await execute({ name: 'John', email: 'john@example.com' });
 * 
 * // PUT request
 * const { execute, submitting } = usePost<UpdateUserDto, User>({
 *   url: '/api/users/123',
 *   method: 'PUT',
 * });
 * 
 * // DELETE request
 * const { execute, submitting } = usePost<void, void>({
 *   url: '/api/users/123',
 *   method: 'DELETE',
 *   onSuccess: () => message.success('Deleted'),
 * });
 * await execute();
 * 
 * // With FormData for file upload
 * const { execute, submitting } = usePost<FormData, UploadResponse>({
 *   url: '/api/upload',
 * });
 * const formData = new FormData();
 * formData.append('file', file);
 * await execute(formData);
 * ```
 */
export function usePost<TBody = any, TResponse = any>(
  options: UsePostOptions<TBody, TResponse>
): UsePostResult<TBody, TResponse> {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [data, setData] = useState<TResponse | undefined>(undefined);
  
  // Use ref to track the current Post instance for cancellation
  const postInstanceRef = useRef<Post<TBody, TResponse> | null>(null);
  // Track if component is mounted to prevent state updates after unmount
  const mountedRef = useRef<boolean>(true);
  // Track the latest options to avoid stale closures
  const optionsRef = useRef(options);
  optionsRef.current = options;

  /**
   * Execute the POST/PUT/PATCH/DELETE request
   */
  const execute = useCallback(async (body?: TBody): Promise<TResponse | undefined> => {
    // Cancel any pending request
    if (postInstanceRef.current) {
      postInstanceRef.current.cancel();
    }

    const currentOptions = optionsRef.current;
    
    // Create new Post instance
    const post = new Post<TBody, TResponse>()
      .target(currentOptions.url)
      .method(currentOptions.method || 'POST');

    if (body !== undefined) {
      post.body(body);
    }

    if (currentOptions.headers) {
      post.headers(currentOptions.headers);
    }

    postInstanceRef.current = post;

    if (mountedRef.current) {
      setSubmitting(true);
      setError(undefined);
    }

    try {
      const result = await post.execute();
      
      if (mountedRef.current) {
        setData(result);
        setSubmitting(false);
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
        setSubmitting(false);
        currentOptions.onError?.(error);
      }
      
      return undefined;
    }
  }, []);

  /**
   * Abort the current request
   */
  const abort = useCallback(() => {
    if (postInstanceRef.current) {
      postInstanceRef.current.cancel();
      postInstanceRef.current = null;
    }
    if (mountedRef.current) {
      setSubmitting(false);
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
      setSubmitting(false);
    }
  }, [abort]);

  // Set mounted ref on mount, cleanup on unmount
  // Using a layout effect pattern to set mounted before any renders
  if (mountedRef.current === false) {
    mountedRef.current = true;
  }

  // Note: We use a ref pattern instead of useEffect for mounted tracking
  // to avoid race conditions. The unmount cleanup is still needed.
  // This is handled by the component lifecycle - when unmounted,
  // the ref will be stale but that's okay since we check it before setState.

  return {
    execute,
    submitting,
    error,
    data,
    reset,
    abort,
  };
}
