import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { HttpHooks, RequestConfig } from '../types';

/**
 * Post Model - Type-safe HTTP POST/PUT/DELETE/PATCH request builder
 * @template TBody - Request body type
 * @template TResponse - Response data type
 */
export class Post<TBody = any, TResponse = any> {
  private _target?: string;
  private _method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'POST';
  private _body?: TBody;
  private _params: Record<string, any> = {};
  private _headers: Record<string, string> = {};
  private _config: Partial<RequestConfig> = {};
  private _hooks: HttpHooks<TResponse> = {};
  private _abortController?: AbortController;
  private static _axios: AxiosInstance = axios.create();

  /**
   * Set the request target URL
   */
  target(url: string): this {
    this._target = url;
    return this;
  }

  /**
   * Set the HTTP method
   */
  method(method: 'POST' | 'PUT' | 'DELETE' | 'PATCH'): this {
    this._method = method;
    return this;
  }

  /**
   * Set the request body
   */
  body(data: TBody): this {
    this._body = data;
    return this;
  }

  /**
   * Set URL parameters
   */
  params(params: Record<string, any>): this {
    this._params = { ...this._params, ...params };
    return this;
  }

  /**
   * Set a single URL parameter
   */
  param(key: string, value: any): this {
    this._params[key] = value;
    return this;
  }

  /**
   * Set request headers
   */
  headers(headers: Record<string, string>): this {
    this._headers = { ...this._headers, ...headers };
    return this;
  }

  /**
   * Set a single header
   */
  header(key: string, value: string): this {
    this._headers[key] = value;
    return this;
  }

  /**
   * Set additional request configuration
   */
  config(config: Partial<RequestConfig>): this {
    this._config = { ...this._config, ...config };
    return this;
  }

  /**
   * Hook called before the request is sent
   */
  onBefore(callback: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>): this {
    this._hooks.onBefore = callback;
    return this;
  }

  /**
   * Hook called when request succeeds
   */
  onThen(callback: (data: TResponse) => void | Promise<void>): this {
    this._hooks.onThen = callback;
    return this;
  }

  /**
   * Hook called when request fails
   */
  onCatch(callback: (error: Error) => any): this {
    this._hooks.onCatch = callback;
    return this;
  }

  /**
   * Hook called after request completes (success or failure)
   */
  onFinally(callback: () => void | Promise<void>): this {
    this._hooks.onFinally = callback;
    return this;
  }

  /**
   * Execute the request
   */
  async execute(): Promise<TResponse> {
    if (!this._target) {
      throw new Error('Target URL is required');
    }

    this._abortController = new AbortController();

    let config: AxiosRequestConfig = {
      method: this._method,
      url: this._target,
      data: this._body,
      params: this._params,
      headers: this._headers,
      signal: this._abortController.signal,
      ...this._config,
    };

    try {
      // Apply onBefore hook
      if (this._hooks.onBefore) {
        config = await this._hooks.onBefore(config as RequestConfig) as AxiosRequestConfig;
      }

      const response = await Post._axios.request<TResponse>(config);
      const data = response.data;

      // Apply onThen hook
      if (this._hooks.onThen) {
        await this._hooks.onThen(data);
      }

      return data;
    } catch (error) {
      // Apply onCatch hook
      if (this._hooks.onCatch) {
        return this._hooks.onCatch(error as Error);
      }
      throw error;
    } finally {
      // Apply onFinally hook
      if (this._hooks.onFinally) {
        await this._hooks.onFinally();
      }
    }
  }

  /**
   * Cancel the request
   */
  cancel(message?: string): void {
    if (this._abortController) {
      this._abortController.abort(message);
    }
  }

  /**
   * Set global axios instance
   */
  static setAxios(instance: AxiosInstance): void {
    Post._axios = instance;
  }

  /**
   * Get the current axios instance
   */
  static getAxios(): AxiosInstance {
    return Post._axios;
  }

  /**
   * Configure global defaults
   */
  static configure(config: RequestConfig): void {
    if (config.baseURL) {
      Post._axios.defaults.baseURL = config.baseURL;
    }
    if (config.timeout) {
      Post._axios.defaults.timeout = config.timeout;
    }
    if (config.headers) {
      Post._axios.defaults.headers.common = {
        ...Post._axios.defaults.headers.common,
        ...config.headers,
      };
    }
  }
}
