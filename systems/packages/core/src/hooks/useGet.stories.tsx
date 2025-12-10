import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Card, List, Spin, Alert, Button, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useGet } from './useGet';
import { MainProvider } from '../main/MainContext';

interface User {
  id: number;
  name: string;
  email: string;
}

const meta: Meta = {
  title: 'Hooks/useGet',
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
        component: 'React hook for GET requests with automatic state management.',
      },
    },
  },
};

export default meta;

/**
 * Basic useGet with auto-fetch
 */
export const BasicUsage: StoryObj = {
  render: () => {
    const { data, loading, error, refetch } = useGet<User[]>({
      target: '/users',
      autoFetch: true,
    });

    if (loading) return <Spin />;
    if (error) return <Alert type="error" message={error.message} />;

    return (
      <Card 
        title="Users" 
        extra={<Button icon={<ReloadOutlined />} onClick={() => refetch()}>Refresh</Button>}
      >
        <List
          dataSource={data?.slice(0, 5)}
          renderItem={(user) => (
            <List.Item>{user.name} - {user.email}</List.Item>
          )}
        />
      </Card>
    );
  },
};

/**
 * Manual fetch control
 */
export const ManualFetch: StoryObj = {
  render: () => {
    const { data, loading, fetch } = useGet<User[]>({
      target: '/users',
      autoFetch: false,
    });

    return (
      <Card title="Manual Fetch">
        <Space direction="vertical">
          <Button type="primary" onClick={() => fetch()} loading={loading}>
            Load Users
          </Button>
          {data && (
            <List
              size="small"
              dataSource={data.slice(0, 3)}
              renderItem={(user) => <List.Item>{user.name}</List.Item>}
            />
          )}
        </Space>
      </Card>
    );
  },
};