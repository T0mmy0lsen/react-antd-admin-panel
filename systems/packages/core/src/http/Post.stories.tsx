import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Card, Button, Input, Space, message, Alert } from 'antd';
import { Post } from './Post';

const meta: Meta = {
  title: 'HTTP/Post',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Type-safe HTTP POST request builder with body and lifecycle hooks.',
      },
    },
  },
};

export default meta;

/**
 * Basic Post request
 */
export const BasicUsage: StoryObj = {
  render: () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleSubmit = () => {
      setLoading(true);
      const post = new Post<{ name: string }, { id: number }>()
        .target('https://jsonplaceholder.typicode.com/users')
        .body({ name })
        .onThen((data) => {
          setResult(`Created with ID: ${data.id}`);
          message.success('User created!');
        })
        .onCatch((err) => message.error(err.message))
        .onFinally(() => setLoading(false));

      post.execute();
    };

    return (
      <Card title="Create User">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            Create
          </Button>
          {result && <Alert type="success" message={result} />}
        </Space>
      </Card>
    );
  },
};

/**
 * Post code example
 */
export const CodeExample: StoryObj = {
  render: () => {
    const code = `const post = new Post<UserInput, User>()
  .target('/api/users')
  .body({ name: 'John', email: 'john@example.com' })
  .method('POST') // or 'PUT', 'PATCH'
  .onThen((user) => console.log('Created:', user.id))
  .onCatch((err) => console.error(err));

await post.execute();`;

    return (
      <Card title="Post Builder Pattern">
        <pre style={{ background: '#f5f5f5', padding: 16 }}>{code}</pre>
      </Card>
    );
  },
};
