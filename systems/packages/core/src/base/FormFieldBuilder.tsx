import { BaseBuilder } from './BaseBuilder';
import type { FormFieldConfig, ValidationRule, FieldValue } from '../types';

export interface FormFieldBuilderConfig extends FormFieldConfig {
  // Extends FormFieldConfig from types
}

/**
 * Base class for all form field builders
 * Extends BaseBuilder with form-specific functionality
 */
export abstract class FormFieldBuilder<
  TConfig extends FormFieldBuilderConfig = FormFieldBuilderConfig,
  TValue extends FieldValue = FieldValue
> extends BaseBuilder<TConfig> {
  protected _value?: TValue;
  protected _onChange?: (value: TValue) => void;

  /**
   * Set the field label
   */
  label(text: string): this {
    (this._config as any).label = text;
    return this;
  }

  /**
   * Set the field placeholder
   */
  placeholder(text: string): this {
    (this._config as any).placeholder = text;
    return this;
  }

  /**
   * Mark field as required
   */
  required(value: boolean = true): this {
    (this._config as any).required = value;
    return this;
  }

  /**
   * Set the field tooltip
   */
  tooltip(text: string): this {
    (this._config as any).tooltip = text;
    return this;
  }

  /**
   * Set validation rules
   */
  rules(rules: ValidationRule[]): this {
    (this._config as any).rules = rules;
    return this;
  }

  /**
   * Add a single validation rule
   */
  rule(rule: ValidationRule): this {
    if (!(this._config as any).rules) {
      (this._config as any).rules = [];
    }
    (this._config as any).rules.push(rule);
    return this;
  }

  /**
   * Set default value
   */
  defaultValue(value: TValue): this {
    (this._config as any).defaultValue = value;
    this._value = value;
    return this;
  }

  /**
   * Set the field value
   */
  value(val: TValue): this {
    this._value = val;
    return this;
  }

  /**
   * Get the current field value
   */
  getValue(): TValue | undefined {
    return this._value;
  }

  /**
   * Set onChange handler
   */
  onChange(handler: (value: TValue) => void): this {
    this._onChange = handler;
    return this;
  }

  /**
   * Handle value change
   */
  protected handleChange(value: TValue): void {
    this._value = value;
    if (this._onChange) {
      this._onChange(value);
    }
  }

  /**
   * Wrap field with label
   */
  protected wrapWithLabel(field: React.ReactNode): React.ReactNode {
    if (!this._config.label) {
      return <div key={this._key} style={{ marginBottom: '16px' }}>{field}</div>;
    }

    const required = (this._config as any).required;
    
    return (
      <div key={this._key} style={{ marginBottom: '16px' }}>
        <div style={{ marginBottom: '4px', fontSize: '14px' }}>
          {required && <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>}
          {this._config.label}
        </div>
        {field}
      </div>
    );
  }
}
