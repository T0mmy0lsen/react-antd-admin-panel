import type { Builder, ComponentConfig } from '../types';

/**
 * Abstract base class for all component builders
 * Implements common builder pattern functionality
 */
export abstract class BaseBuilder<TConfig extends ComponentConfig = ComponentConfig>
  implements Builder<TConfig>
{
  protected _key?: string;
  public _config: Partial<TConfig> = {};

  /**
   * Set a unique key for the component
   */
  key(k: string): this {
    this._key = k;
    return this;
  }

  /**
   * Set disabled state
   */
  disabled(value: boolean): this {
    this._config.disabled = value;
    return this;
  }

  /**
   * Set hidden state
   */
  hidden(value: boolean): this {
    this._config.hidden = value;
    return this;
  }

  /**
   * Get the component key
   */
  protected getKey(): string | undefined {
    return this._key;
  }

  /**
   * Get the configuration
   */
  protected getConfig(): Partial<TConfig> {
    return this._config;
  }

  /**
   * Render the component - must be implemented by subclasses
   */
  abstract render(): React.ReactNode;
}
