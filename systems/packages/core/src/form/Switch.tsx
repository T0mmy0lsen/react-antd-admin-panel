import React from 'react';
import { Switch as AntSwitch } from 'antd';
import { FormFieldBuilder, FormFieldBuilderConfig } from '../base/FormFieldBuilder';

export interface SwitchConfig extends FormFieldBuilderConfig {
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  size?: 'default' | 'small';
  loading?: boolean;
}

/**
 * Switch Field Builder
 * Wrapper for Ant Design Switch component (toggle/boolean input)
 */
export class Switch extends FormFieldBuilder<SwitchConfig, boolean> {
  /**
   * Set content to display when checked
   */
  checkedChildren(content: React.ReactNode): this {
    this._config.checkedChildren = content;
    return this;
  }

  /**
   * Set content to display when unchecked
   */
  unCheckedChildren(content: React.ReactNode): this {
    this._config.unCheckedChildren = content;
    return this;
  }

  /**
   * Set switch size
   */
  size(value: 'default' | 'small'): this {
    this._config.size = value;
    return this;
  }

  /**
   * Set loading state
   */
  loading(value: boolean = true): this {
    this._config.loading = value;
    return this;
  }

  /**
   * Render the switch component
   */
  render(): React.ReactNode {
    if (this._config.hidden) {
      return null;
    }

    // Create a wrapper component with state
    const SwitchWrapper: React.FC = () => {
      const [checked, setChecked] = React.useState(this._value || false);

      const handleChange = (value: boolean) => {
        setChecked(value);
        this.handleChange(value);
      };

      return (
        <AntSwitch
          disabled={this._config.disabled}
          checkedChildren={this._config.checkedChildren}
          unCheckedChildren={this._config.unCheckedChildren}
          size={this._config.size}
          loading={this._config.loading}
          checked={checked}
          onChange={handleChange}
        />
      );
    };

    return this.wrapWithLabel(<SwitchWrapper />);
  }
}
