import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Card, Button, Input, Space, message, Alert } from 'antd';
import { usePost } from './usePost';
import { MainProvider } from '../main/MainContext';

interface UserInput {
  name: string;
  email: string;
}

interface UserResponse {
  id: number;
  name: string;
}

const meta: Meta = {
  title: 'Hooks/usePost',
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
        component: 'React hook for POST requests with loading and error state.',
      },
    },
  },
};

export default meta;

/**
 * Basic usePost for form submission
 */
export const BasicUsage: StoryObj = {
  render: () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const { execute, loading, error, data } = usePost<UserInput, UserResponse>({
      target: '/users',
      onSuccess: (user) => {
        message.success(`Created user with ID: ${user.id}`);
      },
    });

    const handleSubmit = () => {
      execute({ name, email });
    };

    return (
      <Card title="Create User">
        <Space direction="vertical" style={{ width: '100%' }}>
          {error && <Alert type="error" message={error.message} />}
          {data && <Alert type="success" message={`Created: ${data.name}`} />}
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
            Create
          </Button>
        </Space>
      </Card>
    );
  },
};