import type { Meta, StoryObj } from '@storybook/react';
import { Card } from 'antd';
import { List } from './index';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const meta: Meta = {
  title: 'List/List',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Data list builder with columns, sorting, and pagination.',
      },
    },
  },
};

export default meta;

const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-1234' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-5678' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', phone: '555-9012' },
];

/**
 * Basic List with columns
 */
export const BasicUsage: StoryObj = {
  render: () => {
    const list = new List<User>()
      .column('name', 'Name', { sorter: true })
      .column('email', 'Email')
      .column('phone', 'Phone')
      .dataSource(mockUsers);

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
  .column('name', 'Name', { sorter: true })
  .column('email', 'Email', { width: 200 })
  .column('role', 'Role', (value) => <Tag>{value}</Tag>)
  .pagination({ pageSize: 20 })
  .dataSource(users);

// Render
{list.render()}`;

    return (
      <Card title="List Builder Pattern">
        <pre style={{ background: '#f5f5f5', padding: 16, overflow: 'auto' }}>
          {code}
        </pre>
      </Card>
    );
  },
};
