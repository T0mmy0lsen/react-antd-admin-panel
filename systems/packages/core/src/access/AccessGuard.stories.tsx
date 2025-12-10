import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Card, Button, Alert, Space } from 'antd';
import { AccessGuard } from './Protected';
import { MainProvider } from '../main/MainContext';

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

/**
 * Role-based access control
 */
export const RoleBased: StoryObj = {
  render: () => (
    <MainProvider 
      config={{ pathToApi: '/api' }}
      initialUser={{ id: '1', name: 'Admin', role: 'admin', permissions: [] }}
    >
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
    </MainProvider>
  ),
};

/**
 * Permission-based access control
 */
export const PermissionBased: StoryObj = {
  render: () => (
    <MainProvider 
      config={{ pathToApi: '/api' }}
      initialUser={{ id: '1', name: 'User', role: 'user', permissions: ['users.read', 'users.edit'] }}
    >
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
    </MainProvider>
  ),
};

/**
 * Multiple roles (any match)
 */
export const MultipleRoles: StoryObj = {
  render: () => (
    <MainProvider 
      config={{ pathToApi: '/api' }}
      initialUser={{ id: '1', name: 'Manager', role: 'manager', permissions: [] }}
    >
      <Card title="Multiple Roles (Any Match)">
        <AccessGuard roles={['admin', 'manager']}>
          <Alert type="info" message="Visible to admins OR managers" />
        </AccessGuard>
      </Card>
    </MainProvider>
  ),
};