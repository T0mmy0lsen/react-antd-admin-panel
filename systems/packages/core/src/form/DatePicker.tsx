import React from 'react';
import { DatePicker as AntDatePicker, DatePickerProps as AntDatePickerProps } from 'antd';
import type { Dayjs } from 'dayjs';
import { FormFieldBuilder, FormFieldBuilderConfig } from '../base/FormFieldBuilder';

export interface DatePickerConfig extends FormFieldBuilderConfig {
  format?: string;
  showTime?: boolean;
  showToday?: boolean;
  picker?: 'date' | 'week' | 'month' | 'quarter' | 'year';
  disabledDate?: (current: Dayjs) => boolean;
  allowClear?: boolean;
}

/**
 * DatePicker Field Builder
 * Wrapper for Ant Design DatePicker component with dayjs
 */
export class DatePicker extends FormFieldBuilder<DatePickerConfig, Dayjs | null> {
  /**
   * Set date format
   */
  format(fmt: string): this {
    this._config.format = fmt;
    return this;
  }

  /**
   * Enable time selection
   */
  showTime(value: boolean = true): this {
    this._config.showTime = value;
    return this;
  }

  /**
   * Show today button
   */
  showToday(value: boolean = true): this {
    this._config.showToday = value;
    return this;
  }

  /**
   * Set picker type (date, week, month, quarter, year)
   */
  picker(type: 'date' | 'week' | 'month' | 'quarter' | 'year'): this {
    this._config.picker = type;
    return this;
  }

  /**
   * Set function to disable specific dates
   */
  disabledDate(fn: (current: Dayjs) => boolean): this {
    this._config.disabledDate = fn;
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
   * Render the date picker component
   */
  render(): React.ReactNode {
    if (this._config.hidden) {
      return null;
    }

    const props: AntDatePickerProps = {
      placeholder: this._config.placeholder,
      disabled: this._config.disabled,
      format: this._config.format,
      showTime: this._config.showTime,
      showToday: this._config.showToday,
      picker: this._config.picker,
      disabledDate: this._config.disabledDate,
      allowClear: this._config.allowClear,
      onChange: (date) => this.handleChange(date as any),
    };

    return this.wrapWithLabel(<AntDatePicker {...props} />);
  }
}

export interface RangePickerConfig extends FormFieldBuilderConfig {
  format?: string;
  showTime?: boolean;
  picker?: 'date' | 'week' | 'month' | 'quarter' | 'year';
  disabledDate?: (current: Dayjs) => boolean;
  allowClear?: boolean;
}

/**
 * RangePicker Field Builder
 * Wrapper for Ant Design RangePicker component
 */
export class RangePicker extends FormFieldBuilder<RangePickerConfig, [Dayjs | null, Dayjs | null] | null> {
  /**
   * Set date format
   */
  format(fmt: string): this {
    this._config.format = fmt;
    return this;
  }

  /**
   * Enable time selection
   */
  showTime(value: boolean = true): this {
    this._config.showTime = value;
    return this;
  }

  /**
   * Set picker type (date, week, month, quarter, year)
   */
  picker(type: 'date' | 'week' | 'month' | 'quarter' | 'year'): this {
    this._config.picker = type;
    return this;
  }

  /**
   * Set function to disable specific dates
   */
  disabledDate(fn: (current: Dayjs) => boolean): this {
    this._config.disabledDate = fn;
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
   * Render the range picker component
   */
  render(): React.ReactNode {
    if (this._config.hidden) {
      return null;
    }

    const props: any = {
      placeholder: this._config.placeholder ? [this._config.placeholder, this._config.placeholder] : undefined,
      disabled: this._config.disabled,
      format: this._config.format,
      showTime: this._config.showTime,
      picker: this._config.picker,
      disabledDate: this._config.disabledDate,
      allowClear: this._config.allowClear,
      value: this._value,
      onChange: (dates: any) => this.handleChange(dates),
    };

    return <AntDatePicker.RangePicker key={this._key} {...props} />;
  }
}
