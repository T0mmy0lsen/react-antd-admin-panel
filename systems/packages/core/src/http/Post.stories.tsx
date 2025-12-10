import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Card, Button, Input, Space, message, Form } from 'antd';
import { Post } from './Post';

interface UserInput {
  name: string;
  email: string;
}

interface UserResponse {
  id: number;
  name: string;
  email: string;
}

const meta: Meta = {
  title: 'HTTP/Post',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Type-safe HTTP POST request builder with body typing.',
      },
    },
  },
};

export default meta;

/**
 * Basic Post request with typed body and response
 */
export const BasicUsage: StoryObj = {
  render: () => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async () => {
      setLoading(true);
      
      const post = new Post<UserInput, UserResponse>()
        .target('https://jsonplaceholder.typicode.com/users')
        .body({ name, email })
        .onThen((user) => {
          message.success(`Created user: ${user.name}`);
        })
        .onCatch((err) => {
          message.error(err.message);
        })
        .onFinally(() => setLoading(false));

      await post.execute();
    };

    return (
      <Card title="Create User">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input 
            placeholder="Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          <Input 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            Create User
          </Button>
        </Space>
      </Card>
    );
  },
};

/**
 * Post with different HTTP methods
 */
export const OtherMethods: StoryObj = {
  render: () => {
    const code = `// PUT request
const put = new Post<UserInput, UserResponse>()
  .target('/api/users/1')
  .method('PUT')
  .body({ name: 'Updated Name' });

// DELETE request
const del = new Post<void, void>()
  .target('/api/users/1')
  .method('DELETE');`;

    return (
      <Card title="Other HTTP Methods">
        <pre style={{ background: '#f5f5f5', padding: 16 }}>{code}</pre>
      </Card>
    );
  },
};