import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect } from 'react';
import { Card, Tag, Descriptions } from 'antd';
import { useAccess } from './useAccess';
import { useMain } from '../main/MainContext';

const meta: Meta = {
  title: 'Hooks/useAccess',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'React hook for checking user roles, permissions, and feature access.',
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

const AccessDemo = () => {
  const { 
    hasRole, 
    hasPermission, 
    hasAnyRole, 
    isAuthenticated,
    currentRole 
  } = useAccess();

  return (
    <Card title="Access Check Results">
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Is Authenticated">
          <Tag color={isAuthenticated ? 'green' : 'red'}>
            {isAuthenticated ? 'Yes' : 'No'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Current Role">
          <Tag>{currentRole || 'None'}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Has 'admin' role">
          <Tag color={hasRole('admin') ? 'green' : 'red'}>
            {hasRole('admin') ? 'Yes' : 'No'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Has 'users.edit' permission">
          <Tag color={hasPermission('users.edit') ? 'green' : 'red'}>
            {hasPermission('users.edit') ? 'Yes' : 'No'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Has any of ['admin', 'manager']">
          <Tag color={hasAnyRole(['admin', 'manager']) ? 'green' : 'red'}>
            {hasAnyRole(['admin', 'manager']) ? 'Yes' : 'No'}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

/**
 * Access check with admin user
 */
export const AdminUser: StoryObj = {
  render: () => (
    <SetUser role="admin" permissions={['users.edit', 'users.delete']}>
      <AccessDemo />
    </SetUser>
  ),
};

/**
 * Access check with regular user
 */
export const RegularUser: StoryObj = {
  render: () => (
    <SetUser role="user" permissions={['users.read']}>
      <AccessDemo />
    </SetUser>
  ),
};