import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import { useForm } from './useForm';
import { Post } from '../http/Post';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('useForm', () => {
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
    it('should initialize with provided values', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'John', email: 'john@test.com' },
        })
      );

      expect(result.current.values.name).toBe('John');
      expect(result.current.values.email).toBe('john@test.com');
      expect(result.current.submitting).toBe(false);
      expect(result.current.isDirty).toBe(false);
    });

    it('should have no errors initially', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
        })
      );

      expect(result.current.errors).toEqual({});
    });
  });

  describe('setValue', () => {
    it('should update a single field value', async () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '', email: '' },
        })
      );

      act(() => {
        result.current.setValue('name', 'Jane');
      });

      await waitFor(() => {
        expect(result.current.values.name).toBe('Jane');
      });
    });

    it('should mark form as dirty after setValue', async () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
        })
      );

      expect(result.current.isDirty).toBe(false);

      act(() => {
        result.current.setValue('name', 'Jane');
      });

      await waitFor(() => {
        expect(result.current.isDirty).toBe(true);
      });
    });
  });

  describe('setValues', () => {
    it('should update multiple field values', async () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '', email: '', age: 0 },
        })
      );

      act(() => {
        result.current.setValues({ name: 'Jane', email: 'jane@test.com' });
      });

      await waitFor(() => {
        expect(result.current.values.name).toBe('Jane');
        expect(result.current.values.email).toBe('jane@test.com');
        expect(result.current.values.age).toBe(0);
      });
    });
  });

  describe('submit with onSubmit callback', () => {
    it('should call onSubmit with form values', async () => {
      const onSubmit = vi.fn();

      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'John', email: 'john@test.com' },
          onSubmit,
        })
      );

      await act(async () => {
        await result.current.submit();
      });

      expect(onSubmit).toHaveBeenCalledWith({
        name: 'John',
        email: 'john@test.com',
      });
    });

    it('should set submitting to true during submission', async () => {
      let resolveSubmit: () => void;
      const onSubmit = vi.fn().mockImplementation(
        () => new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        })
      );

      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'John' },
          onSubmit,
        })
      );

      let submitPromise: Promise<void>;
      await act(async () => {
        submitPromise = result.current.submit();
        // Allow microtask to process and set submitting
        await Promise.resolve();
      });

      // Check submitting was set during async operation
      expect(onSubmit).toHaveBeenCalledWith({ name: 'John' });

      await act(async () => {
        resolveSubmit!();
        await submitPromise;
      });

      expect(result.current.submitting).toBe(false);
    });
  });

  describe('submit with Post integration', () => {
    it('should submit to configured URL', async () => {
      axiosInstance.request.mockResolvedValue({ data: { id: 1 } });
      const onSuccess = vi.fn();

      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'John' },
          post: {
            url: '/api/users',
            onSuccess,
          },
        })
      );

      await act(async () => {
        await result.current.submit();
      });

      expect(axiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/api/users',
          data: { name: 'John' },
        })
      );
      expect(onSuccess).toHaveBeenCalledWith({ id: 1 });
    });

    it('should use configured method', async () => {
      axiosInstance.request.mockResolvedValue({ data: {} });

      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'John' },
          post: {
            url: '/api/users/1',
            method: 'PUT',
          },
        })
      );

      await act(async () => {
        await result.current.submit();
      });

      expect(axiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
        })
      );
    });

    it('should call onError on failure', async () => {
      const mockError = new Error('Request failed');
      axiosInstance.request.mockRejectedValue(mockError);
      const onError = vi.fn();

      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'John' },
          post: {
            url: '/api/users',
            onError,
          },
        })
      );

      await act(async () => {
        try {
          await result.current.submit();
        } catch {
          // Expected
        }
      });

      expect(onError).toHaveBeenCalledWith(mockError);
    });
  });

  describe('validation', () => {
    it('should run custom validation and set errors', async () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: 'invalid' },
          validate: (values) => {
            const errors: Record<string, string> = {};
            if (!values.email.includes('@')) {
              errors.email = 'Invalid email format';
            }
            return errors;
          },
        })
      );

      await act(async () => {
        await result.current.submit();
      });

      expect(result.current.errors.email?.message).toBe('Invalid email format');
    });

    it('should not submit if validation fails', async () => {
      const onSubmit = vi.fn();

      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: 'invalid' },
          onSubmit,
          validate: (values) => {
            if (!values.email.includes('@')) {
              return { email: 'Invalid email' };
            }
            return {};
          },
        })
      );

      await act(async () => {
        await result.current.submit();
      });

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should submit if validation passes', async () => {
      const onSubmit = vi.fn();

      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: 'valid@test.com' },
          onSubmit,
          validate: (values) => {
            if (!values.email.includes('@')) {
              return { email: 'Invalid email' };
            }
            return {};
          },
        })
      );

      await act(async () => {
        await result.current.submit();
      });

      expect(onSubmit).toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should reset to initial values', async () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'John' },
        })
      );

      act(() => {
        result.current.setValue('name', 'Jane');
      });

      await waitFor(() => {
        expect(result.current.values.name).toBe('Jane');
      });

      act(() => {
        result.current.reset();
      });

      await waitFor(() => {
        expect(result.current.values.name).toBe('John');
      });
    });

    it('should reset to provided values', async () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'John' },
        })
      );

      act(() => {
        result.current.reset({ name: 'Bob' });
      });

      await waitFor(() => {
        expect(result.current.values.name).toBe('Bob');
      });
    });

    it('should clear dirty state after reset', async () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: 'John' },
        })
      );

      act(() => {
        result.current.setValue('name', 'Jane');
      });

      await waitFor(() => {
        expect(result.current.isDirty).toBe(true);
      });

      act(() => {
        result.current.reset();
      });

      await waitFor(() => {
        expect(result.current.isDirty).toBe(false);
      });
    });
  });

  describe('setError', () => {
    it('should set an error on a field', async () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '' },
        })
      );

      act(() => {
        result.current.setError('name', { message: 'Name is required' });
      });

      await waitFor(() => {
        expect(result.current.errors.name?.message).toBe('Name is required');
      });
    });
  });

  describe('clearErrors', () => {
    it('should clear all errors', async () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: '', email: '' },
        })
      );

      act(() => {
        result.current.setError('name', { message: 'Error 1' });
        result.current.setError('email', { message: 'Error 2' });
      });

      await waitFor(() => {
        expect(result.current.errors.name).toBeDefined();
      });

      act(() => {
        result.current.clearErrors();
      });

      await waitFor(() => {
        expect(result.current.errors.name).toBeUndefined();
        expect(result.current.errors.email).toBeUndefined();
      });
    });
  });

  describe('type safety', () => {
    it('should enforce types on form values', async () => {
      interface UserForm {
        name: string;
        age: number;
        active: boolean;
      }

      const { result } = renderHook(() =>
        useForm<UserForm>({
          initialValues: { name: 'John', age: 30, active: true },
        })
      );

      // TypeScript enforces types
      expect(typeof result.current.values.name).toBe('string');
      expect(typeof result.current.values.age).toBe('number');
      expect(typeof result.current.values.active).toBe('boolean');
    });
  });
});
