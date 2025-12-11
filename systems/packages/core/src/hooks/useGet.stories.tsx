import type { Meta, StoryObj } from '@storybook/react';
import { Card, List, Spin, Alert, Button, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useGet } from './useGet';

interface User {
  id: number;
  name: string;
  email: string;
}

const meta: Meta = {
  title: 'Hooks/useGet',
  tags: ['autodocs'],
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
    const { data, loading, error, execute } = useGet<User[]>({
      url: '/users',
      immediate: true,
    });

    if (loading) return <Spin />;
    if (error) return <Alert type="error" message={error.message} />;

    return (
      <Card 
        title="Users" 
        extra={<Button icon={<ReloadOutlined />} onClick={() => execute()}>Refresh</Button>}
      >
        <List
          dataSource={data?.slice(0, 3)}
          renderItem={(user) => (
            <List.Item>{user.name} - {user.email}</List.Item>
          )}
        />
      </Card>
    );
  },
};

/**
 * Manual fetch with useGet
 */
export const ManualFetch: StoryObj = {
  render: () => {
    const { data, loading, execute } = useGet<User[]>({
      url: '/users',
      immediate: false,
    });

    return (
      <Card title="Manual Fetch">
        <Space direction="vertical">
          <Button onClick={() => execute()} loading={loading}>
            Fetch Users
          </Button>
          {data && <Alert type="success" message={`Loaded ${data.length} users`} />}
        </Space>
      </Card>
    );
  },
};
