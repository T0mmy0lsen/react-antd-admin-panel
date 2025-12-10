import React from 'react';
import { Input } from 'antd';
import type { TextAreaProps as AntTextAreaProps } from 'antd/es/input';
import { FormFieldBuilder, FormFieldBuilderConfig } from '../base/FormFieldBuilder';

const { TextArea: AntTextArea } = Input;

export interface TextAreaConfig extends FormFieldBuilderConfig {
  rows?: number;
  maxLength?: number;
  minLength?: number;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  showCount?: boolean;
  allowClear?: boolean;
}

/**
 * TextArea Field Builder
 * Wrapper for Ant Design TextArea component
 */
export class TextArea extends FormFieldBuilder<TextAreaConfig, string> {
  /**
   * Set number of rows
   */
  rows(value: number): this {
    this._config.rows = value;
    return this;
  }

  /**
   * Set maximum length
   */
  maxLength(value: number): this {
    this._config.maxLength = value;
    return this;
  }

  /**
   * Set minimum length
   */
  minLength(value: number): this {
    this._config.minLength = value;
    return this;
  }

  /**
   * Enable auto-size (height adjusts to content)
   */
  autoSize(value: boolean | { minRows?: number; maxRows?: number } = true): this {
    this._config.autoSize = value;
    return this;
  }

  /**
   * Show character count
   */
  showCount(value: boolean = true): this {
    this._config.showCount = value;
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
   * Render the textarea component
   */
  render(): React.ReactNode {
    if (this._config.hidden) {
      return null;
    }

    const props: AntTextAreaProps = {
      placeholder: this._config.placeholder,
      disabled: this._config.disabled,
      rows: this._config.rows,
      maxLength: this._config.maxLength,
      autoSize: this._config.autoSize,
      showCount: this._config.showCount,
      allowClear: this._config.allowClear,
      onChange: (e) => this.handleChange(e.target.value),
    };

    return this.wrapWithLabel(<AntTextArea {...props} />);
  }
}
