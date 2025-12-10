import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Get } from '../http/Get';
import type { Key } from 'react';

/**
 * Pagination configuration for useList
 */
export interface UseListPagination {
  /** Current page number (1-indexed) */
  current: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items (for server-side pagination) */
  total?: number;
}

/**
 * Get configuration - either a URL string or an options object
 */
export interface UseListGetConfig {
  /** The URL to fetch data from */
  url: string;
  /** Query parameters */
  params?: Record<string, any>;
  /** Request headers */
  headers?: Record<string, string>;
}

/**
 * Options for the useList hook
 */
export interface UseListOptions<T> {
  /** Data source configuration */
  get: string | UseListGetConfig;
  /** Initial pagination settings */
  pagination?: Partial<UseListPagination> | false;
  /** Initial filter values */
  initialFilters?: Record<string, any>;
  /** Row key field or function */
  rowKey?: string | ((record: T) => Key);
  /** Enable/disable the request (default: true) */
  enabled?: boolean;
  /** Callback on success */
  onSuccess?: (data: T[]) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
  /** Transform response data */
  transform?: (response: any) => { data: T[]; total?: number };
}

/**
 * Return type for the useList hook
 */
export interface UseListResult<T> {
  /** The fetched data */
  data: T[];
  /** Loading state */
  loading: boolean;
  /** Error if request failed */
  error: Error | undefined;
  /** Refresh/refetch data */
  refresh: () => Promise<void>;
  /** Current pagination state */
  pagination: UseListPagination;
  /** Update pagination */
  setPagination: (pagination: Partial<UseListPagination>) => void;
  /** Current filter values */
  filters: Record<string, any>;
  /** Update filters */
  setFilters: (filters: Record<string, any>) => void;
  /** Selected row keys */
  selectedRowKeys: Key[];
  /** Set selected row keys */
  setSelectedRowKeys: (keys: Key[]) => void;
  /** Selected rows */
  selectedRows: T[];
  /** Clear selection */
  clearSelection: () => void;
  /** Reset to initial state */
  reset: () => void;
}

/**
 * useList - React hook for list/table data management
 * 
 * @template T - Data item type
 * @param options - Hook options
 * @returns Hook result with data, loading, pagination, and control functions
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const { data, loading, refresh } = useList<User>({
 *   get: '/api/users',
 * });
 * 
 * // With pagination
 * const { data, pagination, setPagination } = useList<User>({
 *   get: '/api/users',
 *   pagination: { pageSize: 10 },
 * });
 * 
 * // With filters
 * const { data, filters, setFilters } = useList<User>({
 *   get: '/api/users',
 *   initialFilters: { status: 'active' },
 * });
 * 
 * // With selection
 * const { data, selectedRowKeys, setSelectedRowKeys, selectedRows } = useList<User>({
 *   get: '/api/users',
 *   rowKey: 'id',
 * });
 * 
 * // With transform for custom API response
 * const { data } = useList<User>({
 *   get: '/api/users',
 *   transform: (response) => ({
 *     data: response.items,
 *     total: response.totalCount,
 *   }),
 * });
 * ```
 */
export function useList<T extends object = any>(
  options: UseListOptions<T>
): UseListResult<T> {
  const {
    pagination: paginationConfig,
    initialFilters = {},
    rowKey = 'id',
    enabled = true,
  } = options;

  // State
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [pagination, setPaginationState] = useState<UseListPagination>(() => ({
    current: 1,
    pageSize: 10,
    total: 0,
    ...(paginationConfig !== false ? paginationConfig : {}),
  }));
  const [filters, setFiltersState] = useState<Record<string, any>>(initialFilters);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  // Refs
  const getInstanceRef = useRef<Get<any> | null>(null);
  const mountedRef = useRef<boolean>(true);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Get row key for a record
  const getRowKey = useCallback((record: T): Key => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return (record as any)[rowKey];
  }, [rowKey]);

  // Compute selected rows from data and selectedRowKeys
  const selectedRows = useMemo(() => {
    if (selectedRowKeys.length === 0) return [];
    return data.filter(item => selectedRowKeys.includes(getRowKey(item)));
  }, [data, selectedRowKeys, getRowKey]);

  /**
   * Fetch data from the API
   */
  const fetchData = useCallback(async () => {
    // Cancel any pending request
    if (getInstanceRef.current) {
      getInstanceRef.current.cancel();
    }

    const currentOptions = optionsRef.current;
    const currentGet = typeof currentOptions.get === 'string' 
      ? { url: currentOptions.get } 
      : currentOptions.get;

    // Build params with pagination and filters
    const params: Record<string, any> = {
      ...currentGet.params,
      ...filters,
    };

    // Add pagination params if enabled
    if (paginationConfig !== false) {
      params.page = pagination.current;
      params.pageSize = pagination.pageSize;
    }

    // Create new Get instance
    const get = new Get<any>()
      .target(currentGet.url)
      .params(params);

    if (currentGet.headers) {
      get.headers(currentGet.headers);
    }

    getInstanceRef.current = get;

    if (mountedRef.current) {
      setLoading(true);
      setError(undefined);
    }

    try {
      const response = await get.execute();
      
      if (mountedRef.current) {
        let resultData: T[];
        let total: number | undefined;

        // Apply transform if provided
        if (currentOptions.transform) {
          const transformed = currentOptions.transform(response);
          resultData = transformed.data;
          total = transformed.total;
        } else if (Array.isArray(response)) {
          // Response is already an array
          resultData = response;
          total = response.length;
        } else if (response && typeof response === 'object') {
          // Try common response shapes
          resultData = response.data || response.items || response.records || [];
          total = response.total ?? response.totalCount ?? response.count ?? resultData.length;
        } else {
          resultData = [];
          total = 0;
        }

        setData(resultData);
        
        if (paginationConfig !== false && total !== undefined) {
          setPaginationState(prev => ({ ...prev, total }));
        }
        
        setLoading(false);
        currentOptions.onSuccess?.(resultData);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      
      // Don't update state if request was aborted
      if (error.name === 'CanceledError' || error.name === 'AbortError') {
        return;
      }
      
      if (mountedRef.current) {
        setError(error);
        setLoading(false);
        currentOptions.onError?.(error);
      }
    }
  }, [filters, pagination.current, pagination.pageSize, paginationConfig]);

  /**
   * Refresh/refetch data
   */
  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  /**
   * Update pagination
   */
  const setPagination = useCallback((newPagination: Partial<UseListPagination>) => {
    setPaginationState(prev => ({ ...prev, ...newPagination }));
  }, []);

  /**
   * Update filters
   */
  const setFilters = useCallback((newFilters: Record<string, any>) => {
    setFiltersState(newFilters);
    // Reset to first page when filters change
    setPaginationState(prev => ({ ...prev, current: 1 }));
  }, []);

  /**
   * Clear selection
   */
  const clearSelection = useCallback(() => {
    setSelectedRowKeys([]);
  }, []);

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    if (getInstanceRef.current) {
      getInstanceRef.current.cancel();
    }
    setData([]);
    setError(undefined);
    setLoading(false);
    setPaginationState({
      current: 1,
      pageSize: paginationConfig !== false ? (paginationConfig?.pageSize ?? 10) : 10,
      total: 0,
    });
    setFiltersState(initialFilters);
    setSelectedRowKeys([]);
  }, [initialFilters, paginationConfig]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

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
    refresh,
    pagination,
    setPagination,
    filters,
    setFilters,
    selectedRowKeys,
    setSelectedRowKeys,
    selectedRows,
    clearSelection,
    reset,
  };
}
