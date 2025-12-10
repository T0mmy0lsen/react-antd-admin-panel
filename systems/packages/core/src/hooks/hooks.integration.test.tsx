/**
 * Integration tests for hooks module
 * 
 * Tests hooks working together and with builder pattern components
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import React from 'react';
import axios from 'axios';

// Import all hooks
import { useGet } from './useGet';
import { usePost } from './usePost';
import { useList } from './useList';
import { useForm } from './useForm';
import { useAccess } from './useAccess';

// Import dependencies
import { Get } from '../http/Get';
import { Post } from '../http/Post';
import { MainContext } from '../main/MainContext';
import { UserState } from '../main/UserState';
import { GlobalStore } from '../main/Store';
import type { MainInstance } from '../main/types';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('Hooks Integration Tests', () => {
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
    Post.setAxios(axiosInstance);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Helper to create MainContext wrapper
  function createMainWrapper(user: any = null) {
    const userState = new UserState();
    if (user) userState.set(user);
    
    const mainInstance: MainInstance = {
      User: () => userState,
      Store: () => new GlobalStore(),
      config: {},
      navigate: vi.fn(),
      canAccess: () => true,
    };
    
    return function Wrapper({ children }: { children: React.ReactNode }) {
      return React.createElement(
        MainContext.Provider,
        { value: mainInstance },
        children
      );
    };
  }

  describe('useGet + usePost workflow', () => {
    it('should fetch data with useGet then create with usePost', async () => {
      // Initial list data
      const initialUsers = [{ id: 1, name: 'John' }];
      const newUser = { id: 2, name: 'Jane' };
      
      axiosInstance.request
        .mockResolvedValueOnce({ data: initialUsers }) // GET
        .mockResolvedValueOnce({ data: newUser }); // POST

      // Render both hooks
      const { result: getResult } = renderHook(() => 
        useGet<typeof initialUsers>({ url: '/api/users' })
      );

      const { result: postResult } = renderHook(() => 
        usePost<{ name: string }, typeof newUser>({ url: '/api/users' })
      );

      // Wait for initial fetch
      await waitFor(() => {
        expect(getResult.current.loading).toBe(false);
      });
      expect(getResult.current.data).toEqual(initialUsers);

      // Create new user
      await act(async () => {
        await postResult.current.execute({ name: 'Jane' });
      });

      expect(postResult.current.data).toEqual(newUser);
      expect(axiosInstance.request).toHaveBeenCalledTimes(2);
    });
  });

  describe('useList with filters and pagination', () => {
    it('should refetch when filters change', async () => {
      const page1 = [{ id: 1, name: 'Active User' }];
      const filteredPage = [{ id: 2, name: 'Inactive User' }];
      
      // Mock based on params - initial 'active' filter vs 'inactive'
      axiosInstance.request.mockImplementation((config) => {
        const params = config.params || {};
        if (params.status === 'inactive') {
          return Promise.resolve({ data: filteredPage });
        }
        return Promise.resolve({ data: page1 });
      });

      const { result } = renderHook(() => 
        useList<{ id: number; name: string }>({
          get: '/api/users',
          pagination: { pageSize: 10 },
          initialFilters: { status: 'active' },
        })
      );

      // Wait for initial fetch
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.data).toEqual(page1);
      expect(result.current.filters).toEqual({ status: 'active' });

      // Change filters
      act(() => {
        result.current.setFilters({ status: 'inactive' });
      });

      // Should reset to page 1 and refetch
      expect(result.current.pagination.current).toBe(1);

      await waitFor(() => {
        expect(result.current.data).toEqual(filteredPage);
      });
    });

    it('should handle selection correctly', async () => {
      const users = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
        { id: 3, name: 'User 3' },
      ];
      axiosInstance.request.mockResolvedValue({ data: users });

      const { result } = renderHook(() => 
        useList<{ id: number; name: string }>({
          get: '/api/users',
          rowKey: 'id',
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Select some rows
      act(() => {
        result.current.setSelectedRowKeys([1, 3]);
      });

      expect(result.current.selectedRowKeys).toEqual([1, 3]);
      expect(result.current.selectedRows).toEqual([
        { id: 1, name: 'User 1' },
        { id: 3, name: 'User 3' },
      ]);

      // Clear selection
      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.selectedRowKeys).toEqual([]);
      expect(result.current.selectedRows).toEqual([]);
    });
  });

  describe('useForm + usePost workflow', () => {
    it('should submit form via Post integration', async () => {
      const createdUser = { id: 1, name: 'John', email: 'john@test.com' };
      axiosInstance.request.mockResolvedValue({ data: createdUser });
      const onSuccess = vi.fn();

      const { result } = renderHook(() => 
        useForm({
          initialValues: { name: '', email: '' },
          post: {
            url: '/api/users',
            onSuccess,
          },
        })
      );

      // Fill form
      act(() => {
        result.current.setValue('name', 'John');
        result.current.setValue('email', 'john@test.com');
      });

      await waitFor(() => {
        expect(result.current.values.name).toBe('John');
      });

      // Submit
      await act(async () => {
        await result.current.submit();
      });

      expect(axiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/api/users',
          data: { name: 'John', email: 'john@test.com' },
        })
      );
      expect(onSuccess).toHaveBeenCalledWith(createdUser);
    });
  });

  describe('useAccess with protected data flow', () => {
    it('should conditionally fetch based on access', async () => {
      const sensitiveData = [{ id: 1, secret: 'data' }];
      axiosInstance.request.mockResolvedValue({ data: sensitiveData });

      // Render with admin user
      const { result: accessResult } = renderHook(
        () => useAccess(),
        { wrapper: createMainWrapper({ id: 1, role: 'admin', features: { 'SensitiveData': 3 } }) }
      );

      // Check access before fetching
      const canViewSensitive = accessResult.current.hasFeature('SensitiveData', 2);
      expect(canViewSensitive).toBe(true);

      // Now fetch if allowed
      const { result: getResult } = renderHook(() => 
        useGet({
          url: '/api/sensitive',
          enabled: canViewSensitive,
        })
      );

      await waitFor(() => {
        expect(getResult.current.loading).toBe(false);
      });

      expect(getResult.current.data).toEqual(sensitiveData);
    });

    it('should not fetch when access denied', async () => {
      // Render with regular user
      const { result: accessResult } = renderHook(
        () => useAccess(),
        { wrapper: createMainWrapper({ id: 1, role: 'user', features: { 'SensitiveData': 1 } }) }
      );

      // Check access
      const canViewSensitive = accessResult.current.hasFeature('SensitiveData', 3);
      expect(canViewSensitive).toBe(false);

      // Fetch disabled
      const { result: getResult } = renderHook(() => 
        useGet({
          url: '/api/sensitive',
          enabled: canViewSensitive,
        })
      );

      // Should not have made request
      expect(axiosInstance.request).not.toHaveBeenCalled();
      expect(getResult.current.loading).toBe(false);
      expect(getResult.current.data).toBeUndefined();
    });
  });

  describe('Multiple hooks re-render behavior', () => {
    it('should not cause unnecessary re-renders when using multiple hooks', async () => {
      const users = [{ id: 1, name: 'Test' }];
      axiosInstance.request.mockResolvedValue({ data: users });

      let renderCount = 0;

      function useMultipleHooks() {
        renderCount++;
        const list = useList({ get: '/api/users', rowKey: 'id' });
        const form = useForm({ initialValues: { name: '' } });
        return { list, form };
      }

      const { result } = renderHook(() => useMultipleHooks());

      await waitFor(() => {
        expect(result.current.list.loading).toBe(false);
      });

      const renderCountAfterLoad = renderCount;

      // Changing form shouldn't cause list to reload
      act(() => {
        result.current.form.setValue('name', 'Test');
      });

      await waitFor(() => {
        expect(result.current.form.values.name).toBe('Test');
      });

      // Request should only have been made once
      expect(axiosInstance.request).toHaveBeenCalledTimes(1);
      
      // Render count should be reasonable (not excessive)
      // Some re-renders are expected due to state changes
      expect(renderCount).toBeLessThan(renderCountAfterLoad + 10);
    });
  });

  describe('Error handling across hooks', () => {
    it('should handle errors consistently across hooks', async () => {
      const error = new Error('Network error');
      axiosInstance.request.mockRejectedValue(error);

      const onGetError = vi.fn();
      const onPostError = vi.fn();
      const onListError = vi.fn();

      const { result: getResult } = renderHook(() => 
        useGet({ url: '/api/test', onError: onGetError })
      );

      const { result: postResult } = renderHook(() => 
        usePost({ url: '/api/test', onError: onPostError })
      );

      const { result: listResult } = renderHook(() => 
        useList({ get: '/api/test', onError: onListError })
      );

      // Wait for GET and LIST to complete (they auto-execute)
      await waitFor(() => {
        expect(getResult.current.loading).toBe(false);
        expect(listResult.current.loading).toBe(false);
      });

      // Execute POST
      await act(async () => {
        await postResult.current.execute({});
      });

      // All should have errors
      expect(getResult.current.error).toBeDefined();
      expect(postResult.current.error).toBeDefined();
      expect(listResult.current.error).toBeDefined();

      // All callbacks should have been called
      expect(onGetError).toHaveBeenCalled();
      expect(onPostError).toHaveBeenCalled();
      expect(onListError).toHaveBeenCalled();
    });
  });
});
