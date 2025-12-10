import { describe, it, expect } from 'vitest';
import { Select } from './Select';

describe('Select', () => {
  it('should create an instance', () => {
    const select = new Select();
    expect(select).toBeInstanceOf(Select);
  });

  it('should set options', () => {
    const options = [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ];
    const select = new Select().options(options);
    expect((select as any)._config.options).toEqual(options);
  });

  it('should add a single option', () => {
    const select = new Select().option('Option 1', '1');
    expect((select as any)._config.options).toHaveLength(1);
    expect((select as any)._config.options[0]).toEqual({
      label: 'Option 1',
      value: '1',
      disabled: undefined,
    });
  });

  it('should enable multiple selection', () => {
    const select = new Select().multiple();
    expect((select as any)._config.mode).toBe('multiple');
  });

  it('should enable tags mode', () => {
    const select = new Select().tags();
    expect((select as any)._config.mode).toBe('tags');
  });

  it('should enable showSearch', () => {
    const select = new Select().showSearch();
    expect((select as any)._config.showSearch).toBe(true);
  });

  it('should enable allowClear', () => {
    const select = new Select().allowClear();
    expect((select as any)._config.allowClear).toBe(true);
  });

  it('should set loading state', () => {
    const select = new Select().loading();
    expect((select as any)._config.loading).toBe(true);
  });

  it('should set maxTagCount', () => {
    const select = new Select().maxTagCount(3);
    expect((select as any)._config.maxTagCount).toBe(3);
  });

  it('should support generic types', () => {
    interface User {
      id: number;
      name: string;
    }
    const select = new Select<User>()
      .option('John', { id: 1, name: 'John' })
      .option('Jane', { id: 2, name: 'Jane' });
    
    expect((select as any)._config.options).toHaveLength(2);
  });

  it('should render null when hidden', () => {
    const select = new Select().hidden(true);
    const rendered = select.render();
    expect(rendered).toBeNull();
  });
});
