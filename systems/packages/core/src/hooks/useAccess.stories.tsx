import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Card, Tag, Space, Descriptions } from 'antd';
import { useAccess } from './useAccess';
import { MainProvider } from '../main/MainContext';

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
    <MainProvider 
      config={{ pathToApi: '/api' }}
      initialUser={{ id: '1', name: 'Admin', role: 'admin', permissions: ['users.edit', 'users.delete'] }}
    >
      <AccessDemo />
    </MainProvider>
  ),
};

/**
 * Access check with regular user
 */
export const RegularUser: StoryObj = {
  render: () => (
    <MainProvider 
      config={{ pathToApi: '/api' }}
      initialUser={{ id: '2', name: 'User', role: 'user', permissions: ['users.read'] }}
    >
      <AccessDemo />
    </MainProvider>
  ),
};