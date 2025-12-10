import type { Post } from '../http/Post';
import type { Action } from '../action/Action';

/**
 * Value entry tracked by Formula
 */
export interface FormulaValue<T = unknown> {
  /** Current value */
  value: T;
  /** Reset callback to clear the field */
  reset?: () => void;
}

/**
 * Callbacks for Formula lifecycle
 */
export interface FormulaCallbacks<R = unknown> {
  /** Called when submission completes successfully */
  onComplete?: (result: R) => void;
  /** Called when submission fails */
  onError?: (error: Error) => void;
  /** Called after submission finishes (success or error) */
  onFinally?: () => void;
}

/**
 * Formula - Form value collection and submission manager
 * 
 * Collects values from form controls registered via `value()` method,
 * and submits them via a Post model when `submit()` is called.
 * 
 * @typeParam T - Type of the collected form data
 * @typeParam R - Type of the response from Post
 * 
 * @example
 * ```typescript
 * const formula = new Formula<UserInput, User>(
 *   new Post<UserInput, User>()
 *     .target('/api/users')
 *     .onThen((user) => console.log('Created:', user.id))
 * );
 * 
 * // Register values from form controls
 * formula.value('name', 'John');
 * formula.value('email', 'john@example.com');
 * 
 * // Get all collected values
 * const data = formula.params(); // { name: 'John', email: 'john@example.com' }
 * 
 * // Submit the form
 * await formula.submit();
 * ```
 */
export class Formula<T extends Record<string, unknown> = Record<string, unknown>, R = unknown> {
  private _values: Map<string, FormulaValue> = new Map();
  private _post: Post<T, R>;
  private _action: Action | null = null;
  private _callbacks: FormulaCallbacks<R> = {};
  private _isSubmitting = false;

  constructor(post: Post<T, R>) {
    this._post = post;
  }

  /**
   * Register or update a value in the formula
   * @param key - Field key
   * @param value - Field value
   * @param reset - Optional reset callback
   */
  value<K extends keyof T>(key: K, value: T[K], reset?: () => void): this {
    this._values.set(key as string, { value, reset });
    return this;
  }

  /**
   * Get a single value by key
   */
  get<K extends keyof T>(key: K): T[K] | undefined {
    return this._values.get(key as string)?.value as T[K] | undefined;
  }

  /**
   * Check if a value is registered
   */
  has(key: keyof T): boolean {
    return this._values.has(key as string);
  }

  /**
   * Remove a value from the formula
   */
  remove(key: keyof T): this {
    this._values.delete(key as string);
    return this;
  }

  /**
   * Get all collected values as an object
   */
  params(): Partial<T> {
    const result: Record<string, unknown> = {};
    this._values.forEach((entry, key) => {
      result[key] = entry.value;
    });
    return result as Partial<T>;
  }

  /**
   * Reset all registered values
   */
  reset(): this {
    this._values.forEach((entry) => {
      entry.reset?.();
    });
    this._values.clear();
    return this;
  }

  /**
   * Link an action to this formula
   */
  action(action: Action): this {
    this._action = action;
    return this;
  }

  /**
   * Get the linked action
   */
  getAction(): Action | null {
    return this._action;
  }

  /**
   * Get the Post model
   */
  getPost(): Post<T, R> {
    return this._post;
  }

  /**
   * Set callback for successful completion
   */
  onComplete(callback: (result: R) => void): this {
    this._callbacks.onComplete = callback;
    return this;
  }

  /**
   * Set callback for errors
   */
  onError(callback: (error: Error) => void): this {
    this._callbacks.onError = callback;
    return this;
  }

  /**
   * Set callback for finally (always runs)
   */
  onFinally(callback: () => void): this {
    this._callbacks.onFinally = callback;
    return this;
  }

  /**
   * Check if formula is currently submitting
   */
  isSubmitting(): boolean {
    return this._isSubmitting;
  }

  /**
   * Submit the formula via Post
   * @param additionalData - Additional data to merge with form values
   */
  async submit(additionalData?: Partial<T>): Promise<R | undefined> {
    if (this._isSubmitting) {
      return undefined;
    }

    this._isSubmitting = true;

    try {
      // Merge form values with additional data
      const body = {
        ...this.params(),
        ...additionalData,
      } as T;

      // Set body on Post and execute
      this._post.body(body);
      const result = await this._post.execute();

      // Call success callbacks
      this._callbacks.onComplete?.(result);
      this._action?.callComplete?.(result);

      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      
      // Call error callbacks
      this._callbacks.onError?.(err);
      this._action?.callError?.(err);

      throw err;
    } finally {
      this._isSubmitting = false;
      this._callbacks.onFinally?.();
    }
  }
}

export default Formula;