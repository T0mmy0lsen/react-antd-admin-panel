import React from 'react';
import { BaseBuilder } from '../base/BaseBuilder';
import type { ComponentConfig } from '../types';

export interface ConditionConfig extends ComponentConfig {
  condition?: (data?: any) => boolean;
  fallback?: React.ReactNode;
}

export interface ConditionItem {
  key?: string;
  condition: (data?: any) => boolean;
  content: React.ReactNode | (() => React.ReactNode);
}

/**
 * Condition - Conditional rendering builder
 * Renders content based on boolean conditions
 * 
 * @example
 * // Simple condition
 * const cond = new Condition()
 *   .when(() => user.isAdmin, <AdminPanel />)
 *   .otherwise(<AccessDenied />);
 * 
 * // Multiple conditions (switch-like)
 * const cond = new Condition()
 *   .add('admin', (data) => data.role === 'admin', <AdminView />)
 *   .add('user', (data) => data.role === 'user', <UserView />)
 *   .default(<GuestView />);
 */
export class Condition extends BaseBuilder<ConditionConfig> {
  private _items: ConditionItem[] = [];
  private _default?: React.ReactNode | (() => React.ReactNode);
  private _data?: any;

  /**
   * Add a conditional item
   */
  add(
    key: string,
    condition: (data?: any) => boolean,
    content: React.ReactNode | (() => React.ReactNode)
  ): this {
    this._items.push({ key, condition, content });
    return this;
  }

  /**
   * Add a condition with content (fluent API)
   */
  when(
    condition: (data?: any) => boolean,
    content: React.ReactNode | (() => React.ReactNode)
  ): this {
    this._items.push({ condition, content });
    return this;
  }

  /**
   * Set default content when no conditions match
   */
  default(content: React.ReactNode | (() => React.ReactNode)): this {
    this._default = content;
    return this;
  }

  /**
   * Alias for default()
   */
  otherwise(content: React.ReactNode | (() => React.ReactNode)): this {
    return this.default(content);
  }

  /**
   * Set data to evaluate conditions against
   */
  data(value: any): this {
    this._data = value;
    return this;
  }

  /**
   * Check which condition matches and return its content
   */
  private _resolveContent(): React.ReactNode {
    // Find first matching condition
    for (const item of this._items) {
      if (item.condition(this._data)) {
        return typeof item.content === 'function' 
          ? (item.content as () => React.ReactNode)() 
          : item.content;
      }
    }

    // No match, return default
    if (this._default) {
      return typeof this._default === 'function'
        ? (this._default as () => React.ReactNode)()
        : this._default;
    }

    return null;
  }

  /**
   * Clear all conditions
   */
  clear(): this {
    this._items = [];
    this._default = undefined;
    return this;
  }

  /**
   * Get count of conditions
   */
  count(): number {
    return this._items.length;
  }

  /**
   * Render the matching content
   */
  render(): React.ReactNode {
    if (this._config.hidden) {
      return null;
    }

    return this._resolveContent();
  }
}

/**
 * ConditionGroup - Manage multiple conditions that can dynamically update
 * Useful for form-driven UIs where different sections appear based on user input
 * 
 * @example
 * const group = new ConditionGroup()
 *   .add('basic', (data) => data.type === 'basic', basicSection)
 *   .add('advanced', (data) => data.type === 'advanced', advancedSection)
 *   .checkCondition(formData); // Updates active conditions
 */
export class ConditionGroup extends BaseBuilder<ConditionConfig> {
  private _conditions: Map<string, ConditionItem> = new Map();
  private _activeKeys: string[] = [];

  /**
   * Add a named condition
   */
  add(
    key: string,
    condition: (data?: any) => boolean,
    content: React.ReactNode | (() => React.ReactNode)
  ): this {
    this._conditions.set(key, { key, condition, content });
    return this;
  }

  /**
   * Check conditions and update active items
   */
  checkCondition(data?: any): this {
    this._activeKeys = [];

    for (const [key, item] of this._conditions.entries()) {
      if (item.condition(data)) {
        this._activeKeys.push(key);
      }
    }

    return this;
  }

  /**
   * Get currently active condition keys
   */
  getActiveKeys(): string[] {
    return [...this._activeKeys];
  }

  /**
   * Clear all conditions
   */
  clear(): this {
    this._conditions.clear();
    this._activeKeys = [];
    return this;
  }

  /**
   * Render all matching conditions
   */
  render(): React.ReactNode {
    if (this._config.hidden) {
      return null;
    }

    return (
      <>
        {this._activeKeys.map((key, index) => {
          const item = this._conditions.get(key);
          if (!item) return null;

          const content = typeof item.content === 'function'
            ? (item.content as () => React.ReactNode)()
            : item.content;

          return <React.Fragment key={key || index}>{content}</React.Fragment>;
        })}
      </>
    );
  }
}
