import React from 'react';
import { BaseBuilder } from './BaseBuilder';
import type { FormFieldConfig, ValidationRule, FieldValue } from '../types';

export interface FormFieldBuilderConfig extends FormFieldConfig {
  // Extends FormFieldConfig from types
}

// Counter for generating unique IDs
let fieldIdCounter = 0;

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
  protected _fieldId: string;

  constructor() {
    super();
    // Generate unique ID for accessibility (label-input association)
    this._fieldId = `raap-field-${++fieldIdCounter}`;
  }

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
   * Get the field ID for accessibility
   */
  getFieldId(): string {
    return this._fieldId;
  }

  /**
   * Wrap field with label (with proper accessibility association)
   */
  protected wrapWithLabel(field: React.ReactNode): React.ReactNode {
    if (!this._config.label) {
      return <div key={this._key} style={{ marginBottom: '16px' }}>{field}</div>;
    }

    const required = (this._config as any).required;
    const descriptionId = (this._config as any).tooltip ? `${this._fieldId}-description` : undefined;
    
    return (
      <div key={this._key} style={{ marginBottom: '16px' }}>
        <label 
          htmlFor={this._fieldId}
          style={{ 
            display: 'block',
            marginBottom: '4px', 
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          {required && (
            <span style={{ color: '#ff4d4f', marginRight: '4px' }} aria-hidden="true">*</span>
          )}
          {this._config.label}
          {required && (
            <span style={{ 
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: '0',
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              whiteSpace: 'nowrap',
              border: '0'
            }}> (required)</span>
          )}
        </label>
        {(this._config as any).tooltip && (
          <div 
            id={descriptionId}
            style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}
          >
            {(this._config as any).tooltip}
          </div>
        )}
        {React.isValidElement(field) 
          ? React.cloneElement(field as React.ReactElement<any>, { 
              id: this._fieldId,
              'aria-required': required || undefined,
              'aria-describedby': descriptionId,
            })
          : field
        }
      </div>
    );
  }
}
