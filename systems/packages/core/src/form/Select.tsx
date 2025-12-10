import React from 'react';
import { Select as AntSelect, SelectProps as AntSelectProps } from 'antd';
import { FormFieldBuilder, FormFieldBuilderConfig } from '../base/FormFieldBuilder';

export interface SelectOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface SelectConfig<T = any> extends FormFieldBuilderConfig {
  options?: SelectOption<T>[];
  mode?: 'multiple' | 'tags';
  showSearch?: boolean;
  allowClear?: boolean;
  loading?: boolean;
  maxTagCount?: number;
  filterOption?: boolean | ((input: string, option?: SelectOption<T>) => boolean);
}

/**
 * Select Field Builder
 * Wrapper for Ant Design Select component with builder pattern and generics
 * @template T - The type of option values
 */
export class Select<T = any> extends FormFieldBuilder<SelectConfig<T>, T | T[]> {
  /**
   * Set select options
   */
  options(opts: SelectOption<T>[]): this {
    this._config.options = opts;
    return this;
  }

  /**
   * Add a single option
   */
  option(label: string, value: T, disabled?: boolean): this {
    if (!this._config.options) {
      this._config.options = [];
    }
    this._config.options.push({ label, value, disabled });
    return this;
  }

  /**
   * Enable multiple selection
   */
  multiple(value: boolean = true): this {
    this._config.mode = value ? 'multiple' : undefined;
    return this;
  }

  /**
   * Enable tags mode (user can create new options)
   */
  tags(value: boolean = true): this {
    this._config.mode = value ? 'tags' : undefined;
    return this;
  }

  /**
   * Enable search functionality
   */
  showSearch(value: boolean = true): this {
    this._config.showSearch = value;
    return this;
  }

  /**
   * Enable clear button
   */
  allowClear(value: boolean = true): this {
    this._config.allowClear = value;
    return this;
  }

  /**
   * Set loading state
   */
  loading(value: boolean = true): this {
    this._config.loading = value;
    return this;
  }

  /**
   * Set maximum number of tags to display
   */
  maxTagCount(count: number): this {
    this._config.maxTagCount = count;
    return this;
  }

  /**
   * Set custom filter function
   */
  filterOption(fn: boolean | ((input: string, option?: SelectOption<T>) => boolean)): this {
    this._config.filterOption = fn;
    return this;
  }

  /**
   * Render the select component
   */
  render(): React.ReactNode {
    if (this._config.hidden) {
      return null;
    }

    const props: AntSelectProps<T | T[]> = {
      placeholder: this._config.placeholder,
      disabled: this._config.disabled,
      mode: this._config.mode,
      showSearch: this._config.showSearch,
      allowClear: this._config.allowClear,
      loading: this._config.loading,
      maxTagCount: this._config.maxTagCount,
      filterOption: this._config.filterOption as any,
      onChange: (value) => this.handleChange(value as T | T[]),
      options: this._config.options?.map(opt => ({
        label: opt.label,
        value: opt.value as any,
        disabled: opt.disabled,
      })),
    };

    return this.wrapWithLabel(<AntSelect {...props} />);
  }
}
