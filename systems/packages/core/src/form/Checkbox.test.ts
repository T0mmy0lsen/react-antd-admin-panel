import { describe, it, expect } from 'vitest';
import { Checkbox, CheckboxGroup } from './Checkbox';

describe('Checkbox', () => {
  it('should create an instance', () => {
    const checkbox = new Checkbox();
    expect(checkbox).toBeInstanceOf(Checkbox);
  });

  it('should set text', () => {
    const checkbox = new Checkbox().text('Accept terms');
    expect((checkbox as any)._config.text).toBe('Accept terms');
  });

  it('should set indeterminate state', () => {
    const checkbox = new Checkbox().indeterminate();
    expect((checkbox as any)._config.indeterminate).toBe(true);
  });

  it('should support method chaining', () => {
    const checkbox = new Checkbox()
      .text('I agree')
      .required()
      .defaultValue(false);
    
    expect((checkbox as any)._config.text).toBe('I agree');
    expect((checkbox as any)._config.required).toBe(true);
    expect(checkbox.getValue()).toBe(false);
  });

  it('should render null when hidden', () => {
    const checkbox = new Checkbox().hidden(true);
    const rendered = checkbox.render();
    expect(rendered).toBeNull();
  });
});

describe('CheckboxGroup', () => {
  it('should create an instance', () => {
    const group = new CheckboxGroup();
    expect(group).toBeInstanceOf(CheckboxGroup);
  });

  it('should set options', () => {
    const options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ];
    const group = new CheckboxGroup().options(options);
    expect((group as any)._config.options).toEqual(options);
  });

  it('should add a single option', () => {
    const group = new CheckboxGroup().option('Option 1', '1');
    expect((group as any)._config.options).toHaveLength(1);
  });

  it('should set direction', () => {
    const group = new CheckboxGroup().direction('vertical');
    expect((group as any)._config.direction).toBe('vertical');
  });

  it('should render null when hidden', () => {
    const group = new CheckboxGroup().hidden(true);
    const rendered = group.render();
    expect(rendered).toBeNull();
  });
});
