/**
 * createMockHttp - Mock HTTP request utility for testing
 * 
 * Provides a fluent API for mocking Get/Post requests with configurable responses.
 * 
 * @example
 * const mockHttp = createMockHttp()
 *   .onGet('/api/users', { data: mockUsers })
 *   .onPost('/api/users', { data: newUser })
 *   .onGet('/api/error', { error: new Error('Failed') });
 * 
 * // Use in tests
 * await mockHttp.get('/api/users'); // Returns { data: mockUsers }
 */

export interface MockResponse<T = any> {
  /** Response data */
  data?: T;
  /** Error to throw */
  error?: Error;
  /** Delay in ms before responding */
  delay?: number;
  /** HTTP status code (default 200) */
  status?: number;
}

export interface MockHttpConfig {
  /** Default delay for all requests */
  defaultDelay?: number;
}

type RequestHandler = (url: string, params?: Record<string, any>) => Promise<any>;

/**
 * MockHttp - Chainable mock HTTP handler
 */
export class MockHttp {
  private _getHandlers: Map<string, MockResponse> = new Map();
  private _postHandlers: Map<string, MockResponse> = new Map();
  private _defaultDelay: number = 0;

  constructor(config?: MockHttpConfig) {
    this._defaultDelay = config?.defaultDelay || 0;
  }

  /**
   * Register a mock GET response
   */
  onGet<T = any>(url: string, response: MockResponse<T>): this {
    this._getHandlers.set(url, response);
    return this;
  }

  /**
   * Register a mock POST response
   */
  onPost<T = any>(url: string, response: MockResponse<T>): this {
    this._postHandlers.set(url, response);
    return this;
  }

  /**
   * Clear all registered handlers
   */
  clear(): this {
    this._getHandlers.clear();
    this._postHandlers.clear();
    return this;
  }

  /**
   * Get the mock GET handler function
   */
  get: RequestHandler = async (url: string, params?: Record<string, any>) => {
    return this._handleRequest(this._getHandlers, url, params);
  };

  /**
   * Get the mock POST handler function
   */
  post: RequestHandler = async (url: string, data?: Record<string, any>) => {
    return this._handleRequest(this._postHandlers, url, data);
  };

  /**
   * Internal request handler
   */
  private async _handleRequest(
    handlers: Map<string, MockResponse>,
    url: string,
    _data?: Record<string, any>
  ): Promise<any> {
    const response = handlers.get(url);

    if (!response) {
      throw new Error(`No mock handler registered for ${url}`);
    }

    const delay = response.delay ?? this._defaultDelay;
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    if (response.error) {
      throw response.error;
    }

    return {
      data: response.data,
      status: response.status ?? 200,
    };
  }

  /**
   * Get all registered GET handlers (for inspection in tests)
   */
  getRegisteredGetHandlers(): string[] {
    return Array.from(this._getHandlers.keys());
  }

  /**
   * Get all registered POST handlers (for inspection in tests)
   */
  getRegisteredPostHandlers(): string[] {
    return Array.from(this._postHandlers.keys());
  }
}

/**
 * Create a new MockHttp instance
 */
export function createMockHttp(config?: MockHttpConfig): MockHttp {
  return new MockHttp(config);
}
