import { Get } from './Get';
import { Post } from './Post';

export interface LoaderData<T = any> {
  [key: string]: T;
}

export interface LoaderHooks {
  onBeforeLoad?: () => void | Promise<void>;
  onLoad?: (data: LoaderData) => void | Promise<void>;
  onAfterLoad?: (data: LoaderData) => void | Promise<void>;
  onError?: (error: Error) => void | Promise<void>;
}

export interface LoaderRequest<T = any> {
  key: string;
  request: Get<T> | Post<any, T>;
  required?: boolean;
  condition?: (data: LoaderData) => boolean;
}

/**
 * Loader - Data pre-fetching orchestrator for page lifecycle
 * Manages multiple HTTP requests with dependencies and conditions
 * 
 * @example
 * const loader = new Loader()
 *   .add('user', new Get().target('/api/user'))
 *   .add('posts', new Get().target('/api/posts'), { 
 *     condition: (data) => data.user?.isAdmin 
 *   })
 *   .onLoad((data) => console.log('Loaded:', data))
 *   .execute();
 */
export class Loader {
  private _requests: LoaderRequest[] = [];
  private _hooks: LoaderHooks = {};
  private _parallel: boolean = true;
  private _abortOnError: boolean = false;

  /**
   * Add a request to the loader
   */
  add<T = any>(
    key: string, 
    request: Get<T> | Post<any, T>, 
    options?: { required?: boolean; condition?: (data: LoaderData) => boolean }
  ): this {
    this._requests.push({
      key,
      request,
      required: options?.required ?? false,
      condition: options?.condition,
    });
    return this;
  }

  /**
   * Set whether requests execute in parallel (default) or sequentially
   */
  parallel(value: boolean = true): this {
    this._parallel = value;
    return this;
  }

  /**
   * Set whether to abort on first error (default: false)
   */
  abortOnError(value: boolean = true): this {
    this._abortOnError = value;
    return this;
  }

  /**
   * Hook called before any requests are made
   */
  onBeforeLoad(callback: () => void | Promise<void>): this {
    this._hooks.onBeforeLoad = callback;
    return this;
  }

  /**
   * Hook called after all requests complete successfully
   */
  onLoad(callback: (data: LoaderData) => void | Promise<void>): this {
    this._hooks.onLoad = callback;
    return this;
  }

  /**
   * Hook called after onLoad (useful for side effects)
   */
  onAfterLoad(callback: (data: LoaderData) => void | Promise<void>): this {
    this._hooks.onAfterLoad = callback;
    return this;
  }

  /**
   * Hook called if any request fails
   */
  onError(callback: (error: Error) => void | Promise<void>): this {
    this._hooks.onError = callback;
    return this;
  }

  /**
   * Execute all requests with lifecycle management
   */
  async execute(): Promise<LoaderData> {
    const data: LoaderData = {};

    try {
      // Before load hook
      if (this._hooks.onBeforeLoad) {
        await this._hooks.onBeforeLoad();
      }

      if (this._parallel) {
        // Execute all requests in parallel
        await this._executeParallel(data);
      } else {
        // Execute requests sequentially (allows conditions to check previous results)
        await this._executeSequential(data);
      }

      // On load hook
      if (this._hooks.onLoad) {
        await this._hooks.onLoad(data);
      }

      // After load hook
      if (this._hooks.onAfterLoad) {
        await this._hooks.onAfterLoad(data);
      }

      return data;
    } catch (error) {
      // Error hook
      if (this._hooks.onError) {
        await this._hooks.onError(error as Error);
      }
      throw error;
    }
  }

  /**
   * Execute requests in parallel
   */
  private async _executeParallel(data: LoaderData): Promise<void> {
    const promises = this._requests.map(async (req) => {
      // Check condition
      if (req.condition && !req.condition(data)) {
        return;
      }

      try {
        const result = await req.request.execute();
        data[req.key] = result;
      } catch (error) {
        if (req.required || this._abortOnError) {
          throw error;
        }
        // Non-required request failed, continue
        data[req.key] = null;
      }
    });

    await Promise.all(promises);
  }

  /**
   * Execute requests sequentially (allows conditions to depend on previous results)
   */
  private async _executeSequential(data: LoaderData): Promise<void> {
    for (const req of this._requests) {
      // Check condition based on already-loaded data
      if (req.condition && !req.condition(data)) {
        continue;
      }

      try {
        const result = await req.request.execute();
        data[req.key] = result;
      } catch (error) {
        if (req.required || this._abortOnError) {
          throw error;
        }
        // Non-required request failed, continue
        data[req.key] = null;
      }
    }
  }

  /**
   * Create a loader from a configuration object
   */
  static from(config: { 
    requests: LoaderRequest[]; 
    hooks?: LoaderHooks; 
    parallel?: boolean;
    abortOnError?: boolean;
  }): Loader {
    const loader = new Loader();
    loader._requests = config.requests;
    loader._hooks = config.hooks || {};
    loader._parallel = config.parallel ?? true;
    loader._abortOnError = config.abortOnError ?? false;
    return loader;
  }
}
