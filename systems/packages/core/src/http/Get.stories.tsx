import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect, useState } from 'react';
import { Card, List, Spin, Alert } from 'antd';
import { Get } from './Get';

interface User {
  id: number;
  name: string;
  email: string;
}

const meta: Meta = {
  title: 'HTTP/Get',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Type-safe HTTP GET request builder with lifecycle hooks.',
      },
    },
  },
};

export default meta;

/**
 * Basic Get request with builder pattern
 */
export const BasicUsage: StoryObj = {
  render: () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const get = new Get<User[]>()
        .target('https://jsonplaceholder.typicode.com/users')
        .onThen((data) => setUsers(data.slice(0, 3)))
        .onCatch((err) => setError(err.message))
        .onFinally(() => setLoading(false));

      get.fetch();
    }, []);

    if (loading) return <Spin />;
    if (error) return <Alert type="error" message={error} />;

    return (
      <List
        dataSource={users}
        renderItem={(user) => (
          <List.Item>{user.name} - {user.email}</List.Item>
        )}
      />
    );
  },
};

/**
 * Get with query parameters
 */
export const WithParams: StoryObj = {
  render: () => {
    const code = `const get = new Get<User[]>()
  .target('/api/users')
  .params({ page: 1, limit: 10, search: 'john' })
  .headers({ 'X-Custom-Header': 'value' })
  .onThen((users) => console.log(users));`;

    return (
      <Card title="Get with Parameters">
        <pre style={{ background: '#f5f5f5', padding: 16 }}>{code}</pre>
      </Card>
    );
  },
};