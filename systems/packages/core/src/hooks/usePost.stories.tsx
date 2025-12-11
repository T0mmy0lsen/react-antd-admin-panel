import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Card, Button, Input, Space, message, Alert } from 'antd';
import { usePost } from './usePost';

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
 * Basic POST request
 */
export const BasicUsage: StoryObj = {
  render: () => {
    const [name, setName] = useState('');
    const { execute, submitting, data } = usePost<UserInput, UserResponse>({
      url: '/users',
      onSuccess: () => message.success('User created!'),
    });

    return (
      <Card title="Create User">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            type="primary"
            loading={submitting}
            onClick={() => execute({ name, email: `${name.toLowerCase()}@example.com` })}
          >
            Create User
          </Button>
          {data && <Alert type="success" message={`Created user with ID: ${data.id}`} />}
        </Space>
      </Card>
    );
  },
};
