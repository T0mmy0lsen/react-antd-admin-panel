/**
 * HTTP request and response types
 */

export interface HttpConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

export interface RequestConfig extends HttpConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: Record<string, any>;
  data?: any;
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export type HttpInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
export type ResponseInterceptor<T = any> = (response: HttpResponse<T>) => HttpResponse<T> | Promise<HttpResponse<T>>;
export type ErrorInterceptor = (error: Error) => any;

export interface HttpHooks<TResponse = any> {
  onBefore?: HttpInterceptor;
  onThen?: (response: TResponse) => void | Promise<void>;
  onCatch?: ErrorInterceptor;
  onFinally?: () => void | Promise<void>;
}
