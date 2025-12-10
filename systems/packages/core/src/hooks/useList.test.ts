import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import { useList } from './useList';
import { Get } from '../http/Get';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('useList', () => {
  let axiosInstance: any;

  beforeEach(() => {
    vi.clearAllMocks();
    axiosInstance = {
      request: vi.fn(),
      defaults: {
        baseURL: '',
        timeout: 0,
        headers: { common: {} },
      },
    };
    mockedAxios.create.mockReturnValue(axiosInstance);
    Get.setAxios(axiosInstance);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state and data fetching', () => {
    it('should fetch data on mount', async () => {
      const mockData = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];
      axiosInstance.request.mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => 
        useList<{ id: number; name: string }>({
          get: '/api/users',
        })
      );

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeUndefined();
    });

    it('should handle URL string config', async () => {
      axiosInstance.request.mockResolvedValue({ data: [] });

      renderHook(() => 
        useList({ get: '/api/users' })
      );

      await waitFor(() => {
        expect(axiosInstance.request).toHaveBeenCalledWith(
          expect.objectContaining({
            url: '/api/users',
          })
        );
      });
    });

    it('should handle object config with params and headers', async () => {
      axiosInstance.request.mockResolvedValue({ data: [] });

      renderHook(() => 
        useList({
          get: {
            url: '/api/users',
            params: { status: 'active' },
            headers: { 'X-Custom': 'value' },
          },
        })
      );

      await waitFor(() => {
        expect(axiosInstance.request).toHaveBeenCalledWith(
          expect.objectContaining({
            url: '/api/users',
            headers: { 'X-Custom': 'value' },
          })
        );
      });
    });

    it('should not fetch when enabled is false', async () => {
      const { result } = renderHook(() => 
        useList({
          get: '/api/users',
          enabled: false,
        })
      );

      expect(result.current.loading).toBe(false);
      expect(axiosInstance.request).not.toHaveBeenCalled();
    });
  });

  describe('pagination', () => {
    it('should include pagination params in request', async () => {
      axiosInstance.request.mockResolvedValue({ data: [], total: 100 });

      renderHook(() => 
        useList({
          get: '/api/users',
          pagination: { pageSize: 20 },
        })
      );

      await waitFor(() => {
        expect(axiosInstance.request).toHaveBeenCalledWith(
          expect.objectContaining({
            params: expect.objectContaining({
              page: 1,
              pageSize: 20,
            }),
          })
        );
      });
    });

    it('should update pagination and refetch', async () => {
      axiosInstance.request.mockResolvedValue({ data: [], total: 100 });

      const { result } = renderHook(() => 
        useList({
          get: '/api/users',
          pagination: { pageSize: 10 },
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setPagination({ current: 2 });
      });

      await waitFor(() => {
        expect(result.current.pagination.current).toBe(2);
      });
    });

    it('should extract total from response', async () => {
      axiosInstance.request.mockResolvedValue({ 
        data: { data: [{ id: 1 }], total: 50 } 
      });

      const { result } = renderHook(() => 
        useList({
          get: '/api/users',
          transform: (response) => ({
            data: response.data,
            total: response.total,
          }),
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.pagination.total).toBe(50);
    });

    it('should disable pagination when set to false', async () => {
      axiosInstance.request.mockResolvedValue({ data: [] });

      renderHook(() => 
        useList({
          get: '/api/users',
          pagination: false,
        })
      );

      await waitFor(() => {
        expect(axiosInstance.request).toHaveBeenCalledWith(
          expect.objectContaining({
            params: expect.not.objectContaining({
              page: expect.anything(),
              pageSize: expect.anything(),
            }),
          })
        );
      });
    });
  });

  describe('filters', () => {
    it('should include initial filters in request', async () => {
      axiosInstance.request.mockResolvedValue({ data: [] });

      renderHook(() => 
        useList({
          get: '/api/users',
          initialFilters: { status: 'active', role: 'admin' },
        })
      );

      await waitFor(() => {
        expect(axiosInstance.request).toHaveBeenCalledWith(
          expect.objectContaining({
            params: expect.objectContaining({
              status: 'active',
              role: 'admin',
            }),
          })
        );
      });
    });

    it('should update filters and reset to page 1', async () => {
      axiosInstance.request.mockResolvedValue({ data: [] });

      const { result } = renderHook(() => 
        useList({
          get: '/api/users',
          pagination: { pageSize: 10 },
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Go to page 2
      act(() => {
        result.current.setPagination({ current: 2 });
      });

      await waitFor(() => {
        expect(result.current.pagination.current).toBe(2);
      });

      // Change filters - should reset to page 1
      act(() => {
        result.current.setFilters({ status: 'inactive' });
      });

      expect(result.current.pagination.current).toBe(1);
      expect(result.current.filters).toEqual({ status: 'inactive' });
    });
  });

  describe('selection', () => {
    it('should manage selected row keys', async () => {
      const mockData = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];
      axiosInstance.request.mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => 
        useList<{ id: number; name: string }>({
          get: '/api/users',
          rowKey: 'id',
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setSelectedRowKeys([1, 2]);
      });

      expect(result.current.selectedRowKeys).toEqual([1, 2]);
      expect(result.current.selectedRows).toEqual(mockData);
    });

    it('should clear selection', async () => {
      const mockData = [{ id: 1, name: 'User 1' }];
      axiosInstance.request.mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => 
        useList<{ id: number; name: string }>({
          get: '/api/users',
          rowKey: 'id',
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setSelectedRowKeys([1]);
      });

      expect(result.current.selectedRowKeys).toEqual([1]);

      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.selectedRowKeys).toEqual([]);
      expect(result.current.selectedRows).toEqual([]);
    });

    it('should support custom rowKey function', async () => {
      const mockData = [{ uniqueId: 'a1', name: 'User 1' }];
      axiosInstance.request.mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => 
        useList<{ uniqueId: string; name: string }>({
          get: '/api/users',
          rowKey: (record) => record.uniqueId,
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setSelectedRowKeys(['a1']);
      });

      expect(result.current.selectedRows).toEqual(mockData);
    });
  });

  describe('refresh', () => {
    it('should refetch data on refresh', async () => {
      const mockData1 = [{ id: 1 }];
      const mockData2 = [{ id: 1 }, { id: 2 }];
      axiosInstance.request
        .mockResolvedValueOnce({ data: mockData1 })
        .mockResolvedValueOnce({ data: mockData2 });

      const { result } = renderHook(() => 
        useList({ get: '/api/users' })
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData1);
      });

      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.data).toEqual(mockData2);
      expect(axiosInstance.request).toHaveBeenCalledTimes(2);
    });
  });

  describe('reset', () => {
    it('should reset to initial state', async () => {
      const mockData = [{ id: 1 }];
      axiosInstance.request.mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => 
        useList({
          get: '/api/users',
          initialFilters: { status: 'active' },
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Modify state
      act(() => {
        result.current.setFilters({ status: 'inactive' });
        result.current.setPagination({ current: 5 });
        result.current.setSelectedRowKeys([1]);
      });

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.data).toEqual([]);
      expect(result.current.filters).toEqual({ status: 'active' });
      expect(result.current.pagination.current).toBe(1);
      expect(result.current.selectedRowKeys).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('should set error state on request failure', async () => {
      const mockError = new Error('Request failed');
      axiosInstance.request.mockRejectedValue(mockError);

      const { result } = renderHook(() => 
        useList({ get: '/api/users' })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toEqual([]);
    });

    it('should call onError callback', async () => {
      const mockError = new Error('Request failed');
      axiosInstance.request.mockRejectedValue(mockError);
      const onError = vi.fn();

      const { result } = renderHook(() => 
        useList({
          get: '/api/users',
          onError,
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(onError).toHaveBeenCalledWith(mockError);
    });
  });

  describe('callbacks', () => {
    it('should call onSuccess with data', async () => {
      const mockData = [{ id: 1 }];
      axiosInstance.request.mockResolvedValue({ data: mockData });
      const onSuccess = vi.fn();

      const { result } = renderHook(() => 
        useList({
          get: '/api/users',
          onSuccess,
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(onSuccess).toHaveBeenCalledWith(mockData);
    });
  });

  describe('transform', () => {
    it('should transform response data', async () => {
      axiosInstance.request.mockResolvedValue({
        data: {
          items: [{ id: 1 }, { id: 2 }],
          totalCount: 100,
        },
      });

      const { result } = renderHook(() => 
        useList({
          get: '/api/users',
          transform: (response) => ({
            data: response.items,
            total: response.totalCount,
          }),
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual([{ id: 1 }, { id: 2 }]);
      expect(result.current.pagination.total).toBe(100);
    });
  });

  describe('type safety', () => {
    it('should infer correct types', async () => {
      interface User {
        id: number;
        name: string;
        email: string;
      }

      const mockUsers: User[] = [
        { id: 1, name: 'John', email: 'john@test.com' },
      ];
      axiosInstance.request.mockResolvedValue({ data: mockUsers });

      const { result } = renderHook(() => 
        useList<User>({
          get: '/api/users',
          rowKey: 'id',
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // TypeScript enforces User[] shape on data
      const users = result.current.data;
      expect(users[0]?.email).toBe('john@test.com');
    });
  });
});
