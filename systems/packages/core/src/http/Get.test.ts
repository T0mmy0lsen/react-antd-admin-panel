import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { Get } from './Get';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('Get', () => {
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
    Get.setAxios(axiosInstance);
  });

  it('should create an instance', () => {
    const get = new Get();
    expect(get).toBeDefined();
  });

  it('should set target URL', () => {
    const get = new Get();
    const result = get.target('/api/users');
    expect(result).toBe(get); // Method chaining
  });

  it('should set params', () => {
    const get = new Get();
    get.params({ page: 1, limit: 10 });
    expect(get['_params']).toEqual({ page: 1, limit: 10 });
  });

  it('should set single param', () => {
    const get = new Get();
    get.param('search', 'test');
    expect(get['_params']).toEqual({ search: 'test' });
  });

  it('should set headers', () => {
    const get = new Get();
    get.headers({ 'X-Custom': 'value' });
    expect(get['_headers']).toEqual({ 'X-Custom': 'value' });
  });

  it('should set single header', () => {
    const get = new Get();
    get.header('Authorization', 'Bearer token');
    expect(get['_headers']).toEqual({ Authorization: 'Bearer token' });
  });

  it('should support method chaining', () => {
    const get = new Get();
    const result = get
      .target('/api/users')
      .params({ page: 1 })
      .header('X-Custom', 'value');
    expect(result).toBe(get);
  });

  it('should execute GET request', async () => {
    const mockData = [{ id: 1, name: 'User 1' }];
    axiosInstance.request.mockResolvedValue({ data: mockData });

    const get = new Get();
    const result = await get.target('/api/users').execute();

    expect(result).toEqual(mockData);
    expect(axiosInstance.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: '/api/users',
      })
    );
  });

  it('should call onThen hook on success', async () => {
    const mockData = { success: true };
    axiosInstance.request.mockResolvedValue({ data: mockData });

    const onThen = vi.fn();
    const get = new Get();
    await get.target('/api/test').onThen(onThen).execute();

    expect(onThen).toHaveBeenCalledWith(mockData);
  });

  it('should call onCatch hook on error', async () => {
    const error = new Error('Request failed');
    axiosInstance.request.mockRejectedValue(error);

    const onCatch = vi.fn();
    const get = new Get();
    await get.target('/api/test').onCatch(onCatch).execute();

    expect(onCatch).toHaveBeenCalledWith(error);
  });

  it('should call onFinally hook', async () => {
    axiosInstance.request.mockResolvedValue({ data: {} });

    const onFinally = vi.fn();
    const get = new Get();
    await get.target('/api/test').onFinally(onFinally).execute();

    expect(onFinally).toHaveBeenCalled();
  });

  it('should throw error if target is not set', async () => {
    const get = new Get();
    await expect(get.execute()).rejects.toThrow('Target URL is required');
  });
});
