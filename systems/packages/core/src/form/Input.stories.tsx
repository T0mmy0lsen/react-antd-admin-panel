import type { Meta, StoryObj } from '@storybook/react';
import { Card, Space } from 'antd';
import { Input } from './Input';

const meta: Meta = {
  title: 'Form/Input',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Form input builder with label, validation, and tooltip support.',
      },
    },
  },
};

export default meta;

/**
 * Basic Input usage
 */
export const BasicUsage: StoryObj = {
  render: () => {
    const input = new Input()
      .key('username')
      .label('Username')
      .placeholder('Enter username')
      .required(true);

    return (
      <Card title="Basic Input">
        <Space direction="vertical" style={{ width: 300 }}>
          {input.render()}
        </Space>
      </Card>
    );
  },
};

/**
 * Input with tooltip
 */
export const WithTooltip: StoryObj = {
  render: () => {
    const input = new Input()
      .key('email')
      .label('Email')
      .type('email')
      .placeholder('user@example.com')
      .tooltip('We will never share your email');

    return (
      <Card title="Input with Tooltip">
        <Space direction="vertical" style={{ width: 300 }}>
          {input.render()}
        </Space>
      </Card>
    );
  },
};

/**
 * Code example
 */
export const CodeExample: StoryObj = {
  render: () => {
    const code = `const input = new Input()
  .key('email')
  .label('Email Address')
  .required(true)
  .type('email')
  .placeholder('user@example.com')
  .tooltip('Your work email');

// Render in JSX
{input.render()}`;

    return (
      <Card title="Input Builder Pattern">
        <pre style={{ background: '#f5f5f5', padding: 16 }}>{code}</pre>
      </Card>
    );
  },
};
