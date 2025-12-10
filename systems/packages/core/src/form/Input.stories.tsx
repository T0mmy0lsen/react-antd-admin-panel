import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Card, Space } from 'antd';
import { Input } from './Input';

const meta: Meta = {
  title: 'Form/Input',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Input builder component with validation and styling options.',
      },
    },
  },
};

export default meta;

/**
 * Basic Input usage with builder pattern
 */
export const BasicUsage: StoryObj = {
  render: () => {
    const input = new Input()
      .key('email')
      .label('Email Address')
      .placeholder('user@example.com')
      .required(true);

    return (
      <Card title="Basic Input">
        {input.render()}
      </Card>
    );
  },
};

/**
 * Input with different types
 */
export const InputTypes: StoryObj = {
  render: () => (
    <Card title="Input Types">
      <Space direction="vertical" style={{ width: '100%' }}>
        {new Input().key('text').label('Text').placeholder('Enter text').render()}
        {new Input().key('password').label('Password').type('password').render()}
        {new Input().key('number').label('Number').type('number').render()}
        {new Input().key('email').label('Email').type('email').render()}
      </Space>
    </Card>
  ),
};

/**
 * Input with tooltip and disabled state
 */
export const WithOptions: StoryObj = {
  render: () => (
    <Card title="Input Options">
      <Space direction="vertical" style={{ width: '100%' }}>
        {new Input()
          .key('with-tooltip')
          .label('With Tooltip')
          .tooltip('This is helpful information')
          .render()}
        {new Input()
          .key('disabled')
          .label('Disabled')
          .disabled(true)
          .defaultValue('Cannot edit')
          .render()}
      </Space>
    </Card>
  ),
};