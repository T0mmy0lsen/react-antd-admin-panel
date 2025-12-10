import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import { useGet } from './useGet';
import { Get } from '../http/Get';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('useGet', () => {
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

  describe('initial state', () => {
    it('should have loading true when immediate is true (default)', () => {
      axiosInstance.request.mockImplementation(() => new Promise(() => {})); // Never resolves
      
      const { result } = renderHook(() => 
        useGet({ url: '/api/test' })
      );

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeUndefined();
    });

    it('should have loading false when immediate is false', () => {
      const { result } = renderHook(() => 
        useGet({ url: '/api/test', immediate: false })
      );

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeUndefined();
    });

    it('should have loading false when enabled is false', () => {
      const { result } = renderHook(() => 
        useGet({ url: '/api/test', enabled: false })
      );

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('successful requests', () => {
    it('should fetch data on mount when immediate is true', async () => {
      const mockData = [{ id: 1, name: 'Test' }];
      axiosInstance.request.mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => 
        useGet<typeof mockData>({ url: '/api/users' })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeUndefined();
      expect(axiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/api/users',
        })
      );
    });

    it('should pass params to the request', async () => {
      const mockData = { success: true };
      axiosInstance.request.mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => 
        useGet({
          url: '/api/search',
          params: { q: 'test', page: 1 },
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(axiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { q: 'test', page: 1 },
        })
      );
    });

    it('should pass headers to the request', async () => {
      const mockData = { success: true };
      axiosInstance.request.mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => 
        useGet({
          url: '/api/test',
          headers: { 'X-Custom': 'value' },
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(axiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: { 'X-Custom': 'value' },
        })
      );
    });

    it('should call onSuccess callback on success', async () => {
      const mockData = { id: 1 };
      axiosInstance.request.mockResolvedValue({ data: mockData });
      const onSuccess = vi.fn();

      const { result } = renderHook(() => 
        useGet({
          url: '/api/test',
          onSuccess,
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(onSuccess).toHaveBeenCalledWith(mockData);
    });
  });

  describe('error handling', () => {
    it('should set error state on request failure', async () => {
      const mockError = new Error('Request failed');
      axiosInstance.request.mockRejectedValue(mockError);

      const { result } = renderHook(() => 
        useGet({ url: '/api/test' })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBeUndefined();
    });

    it('should call onError callback on failure', async () => {
      const mockError = new Error('Request failed');
      axiosInstance.request.mockRejectedValue(mockError);
      const onError = vi.fn();

      const { result } = renderHook(() => 
        useGet({
          url: '/api/test',
          onError,
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(onError).toHaveBeenCalledWith(mockError);
    });
  });

  describe('manual execution', () => {
    it('should execute request manually when immediate is false', async () => {
      const mockData = { success: true };
      axiosInstance.request.mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => 
        useGet({ url: '/api/test', immediate: false })
      );

      expect(axiosInstance.request).not.toHaveBeenCalled();

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.data).toEqual(mockData);
      expect(axiosInstance.request).toHaveBeenCalled();
    });

    it('should allow overriding params on execute', async () => {
      const mockData = { success: true };
      axiosInstance.request.mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => 
        useGet({
          url: '/api/search',
          params: { page: 1 },
          immediate: false,
        })
      );

      await act(async () => {
        await result.current.execute({ page: 2, filter: 'active' });
      });

      expect(axiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { page: 2, filter: 'active' },
        })
      );
    });

    it('should return data from execute', async () => {
      const mockData = { id: 1, name: 'Test' };
      axiosInstance.request.mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => 
        useGet({ url: '/api/test', immediate: false })
      );

      let returnedData: any;
      await act(async () => {
        returnedData = await result.current.execute();
      });

      expect(returnedData).toEqual(mockData);
    });
  });

  describe('abort', () => {
    it('should abort pending request', async () => {
      let resolveRequest: (value: any) => void;
      axiosInstance.request.mockImplementation(() => 
        new Promise((resolve) => {
          resolveRequest = resolve;
        })
      );

      const { result } = renderHook(() => 
        useGet({ url: '/api/test' })
      );

      expect(result.current.loading).toBe(true);

      act(() => {
        result.current.abort();
      });

      expect(result.current.loading).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset state to initial values', async () => {
      const mockData = { success: true };
      axiosInstance.request.mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => 
        useGet({ url: '/api/test' })
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeUndefined();
      expect(result.current.loading).toBe(false);
    });
  });

  describe('enabled option', () => {
    it('should not fetch when enabled is false', () => {
      axiosInstance.request.mockResolvedValue({ data: {} });

      renderHook(() => 
        useGet({ url: '/api/test', enabled: false })
      );

      expect(axiosInstance.request).not.toHaveBeenCalled();
    });

    it('should fetch when enabled changes to true', async () => {
      const mockData = { success: true };
      axiosInstance.request.mockResolvedValue({ data: mockData });

      const { result, rerender } = renderHook(
        ({ enabled }) => useGet({ url: '/api/test', enabled }),
        { initialProps: { enabled: false } }
      );

      expect(axiosInstance.request).not.toHaveBeenCalled();

      rerender({ enabled: true });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });
    });
  });

  describe('type safety', () => {
    it('should infer correct types', async () => {
      interface User {
        id: number;
        name: string;
      }

      const mockData: User[] = [{ id: 1, name: 'John' }];
      axiosInstance.request.mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => 
        useGet<User[]>({ url: '/api/users' })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // TypeScript will enforce that data is User[] | undefined
      const users = result.current.data;
      expect(users?.[0]?.name).toBe('John');
    });
  });
});
