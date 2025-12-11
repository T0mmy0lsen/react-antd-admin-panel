import type { Meta, StoryObj } from '@storybook/react';
import { Card, Space, message } from 'antd';
import { DeleteOutlined, SaveOutlined, EditOutlined } from '@ant-design/icons';
import { Action } from './Action';
import { ActionButton } from './ActionButton';

const meta: Meta = {
  title: 'Action/ActionButton',
  tags: ['autodocs'],
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
      .buttonType('primary')
      .icon(<SaveOutlined />)
      .callback(async () => {
        await new Promise((r) => setTimeout(r, 500));
        message.success('Saved!');
      });

    const editAction = new Action()
      .key('edit')
      .label('Edit')
      .icon(<EditOutlined />)
      .callback(async () => {
        message.info('Edit clicked');
      });

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
      .danger(true)
      .icon(<DeleteOutlined />)
      .confirm({
        title: 'Delete Item',
        content: 'Are you sure you want to delete this item? This action cannot be undone.',
        okText: 'Delete',
        cancelText: 'Cancel',
        danger: true,
      })
      .callback(async () => {
        await new Promise((r) => setTimeout(r, 500));
        message.success('Deleted!');
      });

    return (
      <Card title="Action with Confirmation">
        <ActionButton action={deleteAction} />
      </Card>
    );
  },
};

/**
 * Code example
 */
export const CodeExample: StoryObj = {
  render: () => {
    const code = `const deleteAction = new Action()
  .key('delete')
  .label('Delete')
  .danger(true)
  .icon(<DeleteOutlined />)
  .confirm({
    title: 'Delete?',
    content: 'This cannot be undone.',
    danger: true,
  })
  .callback(async () => {
    await api.delete(itemId);
    message.success('Deleted!');
  });

<ActionButton action={deleteAction} />`;

    return (
      <Card title="Action Builder Pattern">
        <pre style={{ background: '#f5f5f5', padding: 16, overflow: 'auto' }}>
          {code}
        </pre>
      </Card>
    );
  },
};
