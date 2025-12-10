import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import { usePost } from './usePost';
import { Post } from '../http/Post';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('usePost', () => {
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
    Post.setAxios(axiosInstance);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => 
        usePost({ url: '/api/test' })
      );

      expect(result.current.submitting).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeUndefined();
      expect(typeof result.current.execute).toBe('function');
      expect(typeof result.current.reset).toBe('function');
      expect(typeof result.current.abort).toBe('function');
    });

    it('should not execute on mount', () => {
      renderHook(() => 
        usePost({ url: '/api/test' })
      );

      expect(axiosInstance.request).not.toHaveBeenCalled();
    });
  });

  describe('execute', () => {
    it('should execute POST request with body', async () => {
      const mockResponse = { id: 1, name: 'John' };
      axiosInstance.request.mockResolvedValue({ data: mockResponse });

      const { result } = renderHook(() => 
        usePost<{ name: string }, typeof mockResponse>({
          url: '/api/users',
        })
      );

      await act(async () => {
        await result.current.execute({ name: 'John' });
      });

      expect(axiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/api/users',
          data: { name: 'John' },
        })
      );
      expect(result.current.data).toEqual(mockResponse);
      expect(result.current.submitting).toBe(false);
    });

    it('should execute PUT request', async () => {
      const mockResponse = { id: 1, name: 'Updated' };
      axiosInstance.request.mockResolvedValue({ data: mockResponse });

      const { result } = renderHook(() => 
        usePost({
          url: '/api/users/1',
          method: 'PUT',
        })
      );

      await act(async () => {
        await result.current.execute({ name: 'Updated' });
      });

      expect(axiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: '/api/users/1',
        })
      );
    });

    it('should execute PATCH request', async () => {
      axiosInstance.request.mockResolvedValue({ data: {} });

      const { result } = renderHook(() => 
        usePost({
          url: '/api/users/1',
          method: 'PATCH',
        })
      );

      await act(async () => {
        await result.current.execute({ status: 'active' });
      });

      expect(axiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PATCH',
        })
      );
    });

    it('should execute DELETE request without body', async () => {
      axiosInstance.request.mockResolvedValue({ data: null });

      const { result } = renderHook(() => 
        usePost<void, void>({
          url: '/api/users/1',
          method: 'DELETE',
        })
      );

      await act(async () => {
        await result.current.execute();
      });

      expect(axiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          url: '/api/users/1',
        })
      );
    });

    it('should set submitting to true during request', async () => {
      let resolveRequest: (value: any) => void;
      axiosInstance.request.mockImplementation(() => 
        new Promise((resolve) => {
          resolveRequest = resolve;
        })
      );

      const { result } = renderHook(() => 
        usePost({ url: '/api/test' })
      );

      let executePromise: Promise<any>;
      act(() => {
        executePromise = result.current.execute({ data: 'test' });
      });

      expect(result.current.submitting).toBe(true);

      await act(async () => {
        resolveRequest!({ data: {} });
        await executePromise;
      });

      expect(result.current.submitting).toBe(false);
    });

    it('should pass headers to the request', async () => {
      axiosInstance.request.mockResolvedValue({ data: {} });

      const { result } = renderHook(() => 
        usePost({
          url: '/api/test',
          headers: { 'X-Custom': 'value', 'Authorization': 'Bearer token' },
        })
      );

      await act(async () => {
        await result.current.execute({});
      });

      expect(axiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: { 'X-Custom': 'value', 'Authorization': 'Bearer token' },
        })
      );
    });

    it('should return data from execute', async () => {
      const mockResponse = { id: 1, success: true };
      axiosInstance.request.mockResolvedValue({ data: mockResponse });

      const { result } = renderHook(() => 
        usePost({ url: '/api/test' })
      );

      let returnedData: any;
      await act(async () => {
        returnedData = await result.current.execute({ test: true });
      });

      expect(returnedData).toEqual(mockResponse);
    });
  });

  describe('callbacks', () => {
    it('should call onSuccess on successful request', async () => {
      const mockResponse = { id: 1 };
      axiosInstance.request.mockResolvedValue({ data: mockResponse });
      const onSuccess = vi.fn();

      const { result } = renderHook(() => 
        usePost({
          url: '/api/test',
          onSuccess,
        })
      );

      await act(async () => {
        await result.current.execute({});
      });

      expect(onSuccess).toHaveBeenCalledWith(mockResponse);
    });

    it('should call onError on failed request', async () => {
      const mockError = new Error('Request failed');
      axiosInstance.request.mockRejectedValue(mockError);
      const onError = vi.fn();

      const { result } = renderHook(() => 
        usePost({
          url: '/api/test',
          onError,
        })
      );

      await act(async () => {
        await result.current.execute({});
      });

      expect(onError).toHaveBeenCalledWith(mockError);
    });
  });

  describe('error handling', () => {
    it('should set error state on request failure', async () => {
      const mockError = new Error('Request failed');
      axiosInstance.request.mockRejectedValue(mockError);

      const { result } = renderHook(() => 
        usePost({ url: '/api/test' })
      );

      await act(async () => {
        await result.current.execute({});
      });

      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBeUndefined();
      expect(result.current.submitting).toBe(false);
    });

    it('should clear error on new request', async () => {
      const mockError = new Error('Request failed');
      axiosInstance.request.mockRejectedValueOnce(mockError);
      axiosInstance.request.mockResolvedValueOnce({ data: { success: true } });

      const { result } = renderHook(() => 
        usePost({ url: '/api/test' })
      );

      await act(async () => {
        await result.current.execute({});
      });

      expect(result.current.error).toBeDefined();

      await act(async () => {
        await result.current.execute({});
      });

      expect(result.current.error).toBeUndefined();
      expect(result.current.data).toEqual({ success: true });
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
        usePost({ url: '/api/test' })
      );

      act(() => {
        result.current.execute({});
      });

      expect(result.current.submitting).toBe(true);

      act(() => {
        result.current.abort();
      });

      expect(result.current.submitting).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset state to initial values', async () => {
      const mockResponse = { id: 1 };
      axiosInstance.request.mockResolvedValue({ data: mockResponse });

      const { result } = renderHook(() => 
        usePost({ url: '/api/test' })
      );

      await act(async () => {
        await result.current.execute({});
      });

      expect(result.current.data).toEqual(mockResponse);

      act(() => {
        result.current.reset();
      });

      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeUndefined();
      expect(result.current.submitting).toBe(false);
    });
  });

  describe('FormData support', () => {
    it('should support FormData body', async () => {
      axiosInstance.request.mockResolvedValue({ data: { uploaded: true } });

      const { result } = renderHook(() => 
        usePost<FormData, { uploaded: boolean }>({
          url: '/api/upload',
        })
      );

      const formData = new FormData();
      formData.append('file', 'test-content');

      await act(async () => {
        await result.current.execute(formData);
      });

      expect(axiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/api/upload',
          data: formData,
        })
      );
    });
  });

  describe('type safety', () => {
    it('should infer correct types', async () => {
      interface CreateUserDto {
        name: string;
        email: string;
      }
      interface User {
        id: number;
        name: string;
        email: string;
      }

      const mockUser: User = { id: 1, name: 'John', email: 'john@test.com' };
      axiosInstance.request.mockResolvedValue({ data: mockUser });

      const { result } = renderHook(() => 
        usePost<CreateUserDto, User>({
          url: '/api/users',
        })
      );

      await act(async () => {
        // TypeScript enforces CreateUserDto shape
        await result.current.execute({ name: 'John', email: 'john@test.com' });
      });

      // TypeScript enforces User shape on data
      expect(result.current.data?.id).toBe(1);
      expect(result.current.data?.name).toBe('John');
    });
  });
});
