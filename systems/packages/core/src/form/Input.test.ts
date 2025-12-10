import { describe, it, expect } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('should create an instance', () => {
    const input = new Input();
    expect(input).toBeInstanceOf(Input);
  });

  it('should set type', () => {
    const input = new Input().type('password');
    expect((input as any)._config.type).toBe('password');
  });

  it('should set maxLength', () => {
    const input = new Input().maxLength(100);
    expect((input as any)._config.maxLength).toBe(100);
  });

  it('should set minLength', () => {
    const input = new Input().minLength(5);
    expect((input as any)._config.minLength).toBe(5);
  });

  it('should set prefix', () => {
    const input = new Input().prefix('$');
    expect((input as any)._config.prefix).toBe('$');
  });

  it('should set suffix', () => {
    const input = new Input().suffix('.com');
    expect((input as any)._config.suffix).toBe('.com');
  });

  it('should enable allowClear', () => {
    const input = new Input().allowClear();
    expect((input as any)._config.allowClear).toBe(true);
  });

  it('should set addonBefore', () => {
    const input = new Input().addonBefore('https://');
    expect((input as any)._config.addonBefore).toBe('https://');
  });

  it('should set addonAfter', () => {
    const input = new Input().addonAfter('@example.com');
    expect((input as any)._config.addonAfter).toBe('@example.com');
  });

  it('should support method chaining', () => {
    const input = new Input()
      .label('Email')
      .placeholder('Enter email')
      .type('email')
      .required()
      .maxLength(255);
    
    expect((input as any)._config.label).toBe('Email');
    expect((input as any)._config.placeholder).toBe('Enter email');
    expect((input as any)._config.type).toBe('email');
    expect((input as any)._config.required).toBe(true);
    expect((input as any)._config.maxLength).toBe(255);
  });

  it('should render null when hidden', () => {
    const input = new Input().hidden(true);
    const rendered = input.render();
    expect(rendered).toBeNull();
  });
});
