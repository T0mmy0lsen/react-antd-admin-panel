import { describe, it, expect } from 'vitest';
import React from 'react';
import { FormFieldBuilder, FormFieldBuilderConfig } from './FormFieldBuilder';

// Concrete implementation for testing
class TestFormField extends FormFieldBuilder<FormFieldBuilderConfig, string> {
  render(): React.ReactNode {
    return React.createElement('div', { key: this._key }, this._value);
  }
}

describe('FormFieldBuilder', () => {
  it('should create an instance', () => {
    const field = new TestFormField();
    expect(field).toBeInstanceOf(FormFieldBuilder);
  });

  it('should set label', () => {
    const field = new TestFormField().label('Username');
    expect((field as any)._config.label).toBe('Username');
  });

  it('should set placeholder', () => {
    const field = new TestFormField().placeholder('Enter username');
    expect((field as any)._config.placeholder).toBe('Enter username');
  });

  it('should mark as required', () => {
    const field = new TestFormField().required();
    expect((field as any)._config.required).toBe(true);
  });

  it('should set required to false', () => {
    const field = new TestFormField().required(false);
    expect((field as any)._config.required).toBe(false);
  });

  it('should set tooltip', () => {
    const field = new TestFormField().tooltip('Help text');
    expect((field as any)._config.tooltip).toBe('Help text');
  });

  it('should set validation rules', () => {
    const rules = [{ required: true, message: 'Required' }];
    const field = new TestFormField().rules(rules);
    expect((field as any)._config.rules).toEqual(rules);
  });

  it('should add a single validation rule', () => {
    const rule = { required: true, message: 'Required' };
    const field = new TestFormField().rule(rule);
    expect((field as any)._config.rules).toHaveLength(1);
    expect((field as any)._config.rules[0]).toEqual(rule);
  });

  it('should set default value', () => {
    const field = new TestFormField().defaultValue('test');
    expect(field.getValue()).toBe('test');
    expect((field as any)._config.defaultValue).toBe('test');
  });

  it('should set and get value', () => {
    const field = new TestFormField().value('hello');
    expect(field.getValue()).toBe('hello');
  });

  it('should set onChange handler', () => {
    let capturedValue: string | undefined;
    const field = new TestFormField().onChange((val) => {
      capturedValue = val;
    });
    (field as any).handleChange('changed');
    expect(capturedValue).toBe('changed');
  });

  it('should support method chaining', () => {
    const field = new TestFormField()
      .label('Email')
      .placeholder('email@example.com')
      .required()
      .tooltip('Enter your email');
    
    expect((field as any)._config.label).toBe('Email');
    expect((field as any)._config.placeholder).toBe('email@example.com');
    expect((field as any)._config.required).toBe(true);
    expect((field as any)._config.tooltip).toBe('Enter your email');
  });

  it('should inherit from BaseBuilder', () => {
    const field = new TestFormField()
      .key('test-key')
      .disabled(true)
      .hidden(false);
    
    expect((field as any)._key).toBe('test-key');
    expect((field as any)._config.disabled).toBe(true);
    expect((field as any)._config.hidden).toBe(false);
  });
});
