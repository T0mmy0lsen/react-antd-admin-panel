import React from 'react';
import { Radio as AntRadio, RadioGroupProps as AntRadioGroupProps } from 'antd';
import { FormFieldBuilder, FormFieldBuilderConfig } from '../base/FormFieldBuilder';

export interface RadioOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface RadioGroupConfig<T = any> extends FormFieldBuilderConfig {
  options?: RadioOption<T>[];
  direction?: 'horizontal' | 'vertical';
  buttonStyle?: 'outline' | 'solid';
  optionType?: 'default' | 'button';
  size?: 'large' | 'middle' | 'small';
}

/**
 * RadioGroup Field Builder
 * Wrapper for Ant Design Radio.Group component with generics
 * @template T - The type of radio option values
 */
export class RadioGroup<T = any> extends FormFieldBuilder<RadioGroupConfig<T>, T> {
  /**
   * Set radio options
   */
  options(opts: RadioOption<T>[]): this {
    this._config.options = opts;
    return this;
  }

  /**
   * Add a single radio option
   */
  option(label: string, value: T, disabled?: boolean): this {
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
   * Set button style (only applies when optionType is 'button')
   */
  buttonStyle(style: 'outline' | 'solid'): this {
    this._config.buttonStyle = style;
    return this;
  }

  /**
   * Set option type (default radio or button style)
   */
  optionType(type: 'default' | 'button'): this {
    this._config.optionType = type;
    return this;
  }

  /**
   * Set size (only applies when optionType is 'button')
   */
  size(value: 'large' | 'middle' | 'small'): this {
    this._config.size = value;
    return this;
  }

  /**
   * Render the radio group component
   */
  render(): React.ReactNode {
    if (this._config.hidden) {
      return null;
    }

    const props: AntRadioGroupProps = {
      disabled: this._config.disabled,
      buttonStyle: this._config.buttonStyle,
      optionType: this._config.optionType,
      size: this._config.size,
      value: this._value,
      onChange: (e) => this.handleChange(e.target.value as T),
    };

    const style = this._config.direction === 'vertical' 
      ? { display: 'flex', flexDirection: 'column' as const } 
      : undefined;

    return (
      <AntRadio.Group key={this._key} {...props} style={style}>
        {this._config.options?.map((opt, idx) => {
          const RadioComponent = this._config.optionType === 'button' 
            ? AntRadio.Button 
            : AntRadio;
          
          return (
            <RadioComponent 
              key={idx} 
              value={opt.value} 
              disabled={opt.disabled}
            >
              {opt.label}
            </RadioComponent>
          );
        })}
      </AntRadio.Group>
    );
  }
}

// Alias for convenience
export { RadioGroup as Radio };
