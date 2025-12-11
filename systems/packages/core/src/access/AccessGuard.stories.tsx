import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect } from 'react';
import { Card, Button, Alert, Space } from 'antd';
import { AccessGuard } from './Protected';
import { useMain } from '../main/MainContext';

const meta: Meta = {
  title: 'Access/AccessGuard',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Conditional rendering component based on user roles, permissions, or features.',
      },
    },
  },
};

export default meta;

// Helper to set user for demo purposes
const SetUser = ({ role, permissions, children }: { role: string; permissions: string[]; children: React.ReactNode }) => {
  const main = useMain();
  useEffect(() => {
    main.User().set({ id: '1', name: 'Demo User', role, permissions });
  }, [main, role, permissions]);
  return <>{children}</>;
};

/**
 * Role-based access control
 */
export const RoleBased: StoryObj = {
  render: () => (
    <SetUser role="admin" permissions={[]}>
      <Card title="Role-Based Access">
        <Space direction="vertical">
          <AccessGuard role="admin">
            <Alert type="success" message="You are an admin - you can see this!" />
          </AccessGuard>
          
          <AccessGuard role="superadmin" fallback={<Alert type="warning" message="Superadmin only content (hidden)" />}>
            <Alert type="success" message="Superadmin content" />
          </AccessGuard>
        </Space>
      </Card>
    </SetUser>
  ),
};

/**
 * Permission-based access control
 */
export const PermissionBased: StoryObj = {
  render: () => (
    <SetUser role="user" permissions={['users.read', 'users.edit']}>
      <Card title="Permission-Based Access">
        <Space direction="vertical">
          <AccessGuard permission="users.read">
            <Button>View Users (allowed)</Button>
          </AccessGuard>
          
          <AccessGuard permission="users.delete" fallback={<Button disabled>Delete Users (no permission)</Button>}>
            <Button danger>Delete Users</Button>
          </AccessGuard>
        </Space>
      </Card>
    </SetUser>
  ),
};

/**
 * Multiple roles (any match)
 */
export const MultipleRoles: StoryObj = {
  render: () => (
    <SetUser role="manager" permissions={[]}>
      <Card title="Multiple Roles (Any Match)">
        <AccessGuard roles={['admin', 'manager']}>
          <Alert type="info" message="Visible to admins OR managers" />
        </AccessGuard>
      </Card>
    </SetUser>
  ),
};