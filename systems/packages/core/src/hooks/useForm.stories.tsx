import type { Meta, StoryObj } from '@storybook/react';
import { Card, Button, Space, message, Form, Input as AntInput } from 'antd';
import { useForm } from './useForm';

interface FormData {
  name: string;
  email: string;
}

const meta: Meta = {
  title: 'Hooks/useForm',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'React hook integrating react-hook-form with Post for form submission.',
      },
    },
  },
};

export default meta;

/**
 * Basic form with useForm hook
 */
export const BasicUsage: StoryObj = {
  render: () => {
    const { values, setValue, submit, submitting, errors, isDirty } = useForm<FormData>({
      initialValues: { name: '', email: '' },
      onSubmit: async (data) => {
        await new Promise((r) => setTimeout(r, 1000));
        message.success(`Submitted: ${data.name}`);
      },
    });

    return (
      <Card title="Basic Form">
        <Form layout="vertical">
          <Form.Item 
            label="Name" 
            validateStatus={errors.name ? 'error' : undefined}
            help={errors.name?.message}
          >
            <AntInput
              value={values.name}
              onChange={(e) => setValue('name', e.target.value)}
              placeholder="Enter name"
            />
          </Form.Item>
          <Form.Item 
            label="Email"
            validateStatus={errors.email ? 'error' : undefined}
            help={errors.email?.message}
          >
            <AntInput
              value={values.email}
              onChange={(e) => setValue('email', e.target.value)}
              placeholder="Enter email"
            />
          </Form.Item>
          <Space>
            <Button type="primary" onClick={submit} loading={submitting}>
              Submit
            </Button>
            <span>{isDirty ? '(modified)' : ''}</span>
          </Space>
        </Form>
      </Card>
    );
  },
};
