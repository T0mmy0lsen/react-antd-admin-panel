import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Card, Space, message } from 'antd';
import { DeleteOutlined, SaveOutlined, EditOutlined } from '@ant-design/icons';
import { Action } from './Action';
import { ActionButton } from './ActionButton';
import { MainProvider } from '../main/MainContext';

const meta: Meta = {
  title: 'Action/ActionButton',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MainProvider config={{ pathToApi: '/api' }}>
        <Story />
      </MainProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'Action builder with ActionButton for clickable actions with confirmations.',
      },
    },
  },
};

export default meta;

/**
 * Basic action buttons
 */
export const BasicUsage: StoryObj = {
  render: () => {
    const saveAction = new Action()
      .key('save')
      .label('Save')
      .icon(<SaveOutlined />)
      .buttonType('primary')
      .callback(() => message.success('Saved!'));

    const editAction = new Action()
      .key('edit')
      .label('Edit')
      .icon(<EditOutlined />)
      .callback(() => message.info('Edit clicked'));

    return (
      <Card title="Basic Actions">
        <Space>
          <ActionButton action={saveAction} />
          <ActionButton action={editAction} />
        </Space>
      </Card>
    );
  },
};

/**
 * Action with confirmation dialog
 */
export const WithConfirmation: StoryObj = {
  render: () => {
    const deleteAction = new Action()
      .key('delete')
      .label('Delete')
      .icon(<DeleteOutlined />)
      .buttonType('primary')
      .danger(true)
      .confirm({
        content: 'Are you sure you want to delete this item?',
        title: 'Confirm Delete',
        danger: true,
      })
      .callback(() => message.success('Item deleted'));

    return (
      <Card title="Action with Confirmation">
        <ActionButton action={deleteAction} />
      </Card>
    );
  },
};

/**
 * Async action with loading state
 */
export const AsyncAction: StoryObj = {
  render: () => {
    const asyncAction = new Action()
      .key('async')
      .label('Process Data')
      .buttonType('primary')
      .callback(async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        message.success('Processing complete!');
      });

    return (
      <Card title="Async Action (2 second delay)">
        <ActionButton action={asyncAction} />
      </Card>
    );
  },
};