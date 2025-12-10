import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { Post } from './Post';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('Post', () => {
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
    // Reset the static axios instance
    Post.setAxios(axiosInstance);
  });

  it('should create an instance', () => {
    const post = new Post();
    expect(post).toBeDefined();
  });

  it('should set target URL', () => {
    const post = new Post();
    const result = post.target('/api/users');
    expect(result).toBe(post);
  });

  it('should set request body', () => {
    const post = new Post();
    const body = { name: 'John', email: 'john@example.com' };
    post.body(body);
    expect(post['_body']).toEqual(body);
  });

  it('should set HTTP method', () => {
    const post = new Post();
    post.method('PUT');
    expect(post['_method']).toBe('PUT');
  });

  it('should default to POST method', () => {
    const post = new Post();
    expect(post['_method']).toBe('POST');
  });

  it('should support method chaining', () => {
    const post = new Post();
    const result = post
      .target('/api/users')
      .method('PUT')
      .body({ name: 'John' })
      .header('Content-Type', 'application/json');
    expect(result).toBe(post);
  });

  it('should execute POST request', async () => {
    const mockResponse = { id: 1, name: 'John' };
    axiosInstance.request.mockResolvedValue({ data: mockResponse });

    const post = new Post();
    const body = { name: 'John' };
    const result = await post.target('/api/users').body(body).execute();

    expect(result).toEqual(mockResponse);
    expect(axiosInstance.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: '/api/users',
        data: body,
      })
    );
  });

  it('should execute PUT request', async () => {
    const mockResponse = { id: 1, name: 'John Updated' };
    axiosInstance.request.mockResolvedValue({ data: mockResponse });

    const post = new Post();
    const body = { name: 'John Updated' };
    const result = await post
      .target('/api/users/1')
      .method('PUT')
      .body(body)
      .execute();

    expect(result).toEqual(mockResponse);
    expect(axiosInstance.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'PUT',
        url: '/api/users/1',
        data: body,
      })
    );
  });

  it('should execute DELETE request', async () => {
    axiosInstance.request.mockResolvedValue({ data: { success: true } });

    const post = new Post();
    await post.target('/api/users/1').method('DELETE').execute();

    expect(axiosInstance.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'DELETE',
        url: '/api/users/1',
      })
    );
  });

  it('should call onThen hook on success', async () => {
    const mockData = { success: true };
    axiosInstance.request.mockResolvedValue({ data: mockData });

    const onThen = vi.fn();
    const post = new Post();
    await post.target('/api/test').body({}).onThen(onThen).execute();

    expect(onThen).toHaveBeenCalledWith(mockData);
  });

  it('should call onCatch hook on error', async () => {
    const error = new Error('Request failed');
    axiosInstance.request.mockRejectedValue(error);

    const onCatch = vi.fn();
    const post = new Post();
    await post.target('/api/test').body({}).onCatch(onCatch).execute();

    expect(onCatch).toHaveBeenCalledWith(error);
  });

  it('should throw error if target is not set', async () => {
    const post = new Post();
    await expect(post.execute()).rejects.toThrow('Target URL is required');
  });

  it('should be type-safe with generics', () => {
    interface UserInput {
      name: string;
      email: string;
    }
    interface UserResponse {
      id: number;
      name: string;
      email: string;
    }

    const post = new Post<UserInput, UserResponse>();
    post.target('/api/users').body({ name: 'John', email: 'john@test.com' });
    // TypeScript should enforce types at compile time
    expect(post).toBeDefined();
  });
});
