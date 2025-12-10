import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Card } from 'antd';
import { List } from './index';
import { Get } from '../http/Get';
import { MainProvider } from '../main/MainContext';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const meta: Meta = {
  title: 'List/List',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MainProvider config={{ pathToApi: 'https://jsonplaceholder.typicode.com' }}>
        <Story />
      </MainProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'Data list builder with columns, sorting, and pagination.',
      },
    },
  },
};

export default meta;

/**
 * Basic List with columns
 */
export const BasicUsage: StoryObj = {
  render: () => {
    const list = new List<User>()
      .get(() => new Get<User[]>().target('/users'))
      .column('name', 'Name', { sorter: true })
      .column('email', 'Email')
      .column('phone', 'Phone')
      .footer(true);

    return (
      <Card title="User List">
        {list.render()}
      </Card>
    );
  },
};

/**
 * List configuration code example
 */
export const CodeExample: StoryObj = {
  render: () => {
    const code = `const list = new List<User>()
  .get(() => new Get<User[]>().target('/api/users'))
  .column('name', 'Name', { sorter: true })
  .column('email', 'Email', { width: 200 })
  .column('role', 'Role', (value) => <Tag>{value}</Tag>)
  .footer(true)
  .emptyText('No users found');`;

    return (
      <Card title="List Builder Pattern">
        <pre style={{ background: '#f5f5f5', padding: 16, overflow: 'auto' }}>
          {code}
        </pre>
      </Card>
    );
  },
};