import React from 'react';
import { Input as AntInput, InputProps as AntInputProps } from 'antd';
import { FormFieldBuilder, FormFieldBuilderConfig } from '../base/FormFieldBuilder';

export interface InputConfig extends FormFieldBuilderConfig {
  type?: 'text' | 'password' | 'email' | 'number' | 'url' | 'tel';
  maxLength?: number;
  minLength?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  allowClear?: boolean;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
}

/**
 * Input Field Builder
 * Wrapper for Ant Design Input component with builder pattern
 */
export class Input extends FormFieldBuilder<InputConfig, string> {
  /**
   * Set input type
   */
  type(value: 'text' | 'password' | 'email' | 'number' | 'url' | 'tel'): this {
    this._config.type = value;
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
   * Set prefix icon or element
   */
  prefix(element: React.ReactNode): this {
    this._config.prefix = element;
    return this;
  }

  /**
   * Set suffix icon or element
   */
  suffix(element: React.ReactNode): this {
    this._config.suffix = element;
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
   * Set addon before input
   */
  addonBefore(element: React.ReactNode): this {
    this._config.addonBefore = element;
    return this;
  }

  /**
   * Set addon after input
   */
  addonAfter(element: React.ReactNode): this {
    this._config.addonAfter = element;
    return this;
  }

  /**
   * Render the input component
   */
  render(): React.ReactNode {
    if (this._config.hidden) {
      return null;
    }

    const props: AntInputProps = {
      placeholder: this._config.placeholder,
      disabled: this._config.disabled,
      maxLength: this._config.maxLength,
      prefix: this._config.prefix,
      suffix: this._config.suffix,
      allowClear: this._config.allowClear,
      addonBefore: this._config.addonBefore,
      addonAfter: this._config.addonAfter,
      onChange: (e) => this.handleChange(e.target.value),
    };

    // Handle password type
    const input = this._config.type === 'password'
      ? <AntInput.Password {...props} />
      : <AntInput type={this._config.type || 'text'} {...props} />;

    return this.wrapWithLabel(input);
  }
}
