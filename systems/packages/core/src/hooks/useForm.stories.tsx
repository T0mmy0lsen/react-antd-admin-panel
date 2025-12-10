import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Card, Button, Space, message } from 'antd';
import { useForm } from './useForm';
import { MainProvider } from '../main/MainContext';
import { Input as AntInput, Form } from 'antd';

interface FormData {
  name: string;
  email: string;
}

const meta: Meta = {
  title: 'Hooks/useForm',
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
    const { register, handleSubmit, formState, isSubmitting } = useForm<FormData>({
      post: { target: '/users' },
      onSuccess: () => message.success('Form submitted!'),
    });

    return (
      <Card title="User Form">
        <form onSubmit={handleSubmit}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item 
              label="Name" 
              validateStatus={formState.errors.name ? 'error' : ''}
              help={formState.errors.name?.message}
            >
              <AntInput {...register('name', { required: 'Name is required' })} />
            </Form.Item>
            <Form.Item 
              label="Email"
              validateStatus={formState.errors.email ? 'error' : ''}
              help={formState.errors.email?.message}
            >
              <AntInput {...register('email', { 
                required: 'Email is required',
                pattern: { value: /^[^@]+@[^@]+$/, message: 'Invalid email' }
              })} />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Submit
            </Button>
          </Space>
        </form>
      </Card>
    );
  },
};