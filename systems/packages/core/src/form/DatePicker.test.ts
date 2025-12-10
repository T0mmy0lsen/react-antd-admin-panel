import { describe, it, expect } from 'vitest';
import { DatePicker, RangePicker } from './DatePicker';

describe('DatePicker', () => {
  it('should create an instance', () => {
    const picker = new DatePicker();
    expect(picker).toBeInstanceOf(DatePicker);
  });

  it('should set format', () => {
    const picker = new DatePicker().format('YYYY-MM-DD');
    expect((picker as any)._config.format).toBe('YYYY-MM-DD');
  });

  it('should enable showTime', () => {
    const picker = new DatePicker().showTime();
    expect((picker as any)._config.showTime).toBe(true);
  });

  it('should enable showToday', () => {
    const picker = new DatePicker().showToday();
    expect((picker as any)._config.showToday).toBe(true);
  });

  it('should set picker type', () => {
    const picker = new DatePicker().picker('month');
    expect((picker as any)._config.picker).toBe('month');
  });

  it('should enable allowClear', () => {
    const picker = new DatePicker().allowClear();
    expect((picker as any)._config.allowClear).toBe(true);
  });

  it('should render null when hidden', () => {
    const picker = new DatePicker().hidden(true);
    const rendered = picker.render();
    expect(rendered).toBeNull();
  });
});

describe('RangePicker', () => {
  it('should create an instance', () => {
    const picker = new RangePicker();
    expect(picker).toBeInstanceOf(RangePicker);
  });

  it('should set format', () => {
    const picker = new RangePicker().format('YYYY-MM-DD');
    expect((picker as any)._config.format).toBe('YYYY-MM-DD');
  });

  it('should enable showTime', () => {
    const picker = new RangePicker().showTime();
    expect((picker as any)._config.showTime).toBe(true);
  });

  it('should render null when hidden', () => {
    const picker = new RangePicker().hidden(true);
    const rendered = picker.render();
    expect(rendered).toBeNull();
  });
});
