import React from 'react';
import { Checkbox as AntCheckbox } from 'antd';
import { FormFieldBuilder, FormFieldBuilderConfig } from '../base/FormFieldBuilder';

export interface CheckboxConfig extends FormFieldBuilderConfig {
  text?: string;
  indeterminate?: boolean;
}

export interface CheckboxOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface CheckboxGroupConfig extends FormFieldBuilderConfig {
  options?: CheckboxOption[];
  direction?: 'horizontal' | 'vertical';
}

/**
 * Checkbox Field Builder
 * Wrapper for Ant Design Checkbox component
 */
export class Checkbox extends FormFieldBuilder<CheckboxConfig, boolean> {
  /**
   * Set checkbox text/label
   */
  text(value: string): this {
    this._config.text = value;
    return this;
  }

  /**
   * Set indeterminate state
   */
  indeterminate(value: boolean = true): this {
    this._config.indeterminate = value;
    return this;
  }

  /**
   * Render the checkbox component
   */
  render(): React.ReactNode {
    if (this._config.hidden) {
      return null;
    }

    console.log('Rendering Checkbox with value:', this._value);

    // Create a wrapper component with state
    const CheckboxWrapper: React.FC = () => {
      const [checked, setChecked] = React.useState(this._value || false);
      console.log('CheckboxWrapper rendering, checked:', checked);

      const handleChange = (e: any) => {
        console.log('Checkbox clicked:', e.target.checked);
        setChecked(e.target.checked);
        this.handleChange(e.target.checked);
      };

      return (
        <AntCheckbox
          disabled={this._config.disabled}
          indeterminate={this._config.indeterminate}
          checked={checked}
          onChange={handleChange}
        >
          {this._config.text}
        </AntCheckbox>
      );
    };

    return this.wrapWithLabel(<CheckboxWrapper />);
  }
}

/**
 * CheckboxGroup Field Builder
 * Wrapper for Ant Design Checkbox.Group component
 */
export class CheckboxGroup extends FormFieldBuilder<CheckboxGroupConfig, (string | number)[]> {
  /**
   * Set checkbox options
   */
  options(opts: CheckboxOption[]): this {
    this._config.options = opts;
    return this;
  }

  /**
   * Add a single checkbox option
   */
  option(label: string, value: string | number, disabled?: boolean): this {
    if (!this._config.options) {
      this._config.options = [];
    }
    this._config.options.push({ label, value, disabled });
    return this;
  }

  /**
   * Set layout direction
   */
  direction(dir: 'horizontal' | 'vertical'): this {
    this._config.direction = dir;
    return this;
  }

  /**
   * Render the checkbox group component
   */
  render(): React.ReactNode {
    if (this._config.hidden) {
      return null;
    }

    const options = this._config.options?.map(opt => ({
      label: opt.label,
      value: opt.value,
      disabled: opt.disabled,
    }));

    return (
      <AntCheckbox.Group
        key={this._key}
        disabled={this._config.disabled}
        options={options}
        value={this._value}
        onChange={(values) => this.handleChange(values as (string | number)[])}
        style={this._config.direction === 'vertical' ? { display: 'flex', flexDirection: 'column' } : undefined}
      />
    );
  }
}
