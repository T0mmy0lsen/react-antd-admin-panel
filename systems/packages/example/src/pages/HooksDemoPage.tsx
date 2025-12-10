import { useState } from 'react';
import { Typography, Button, Space, Card, Divider, Input, Form, Table, Tag, Alert, Switch } from 'antd';
import { ReloadOutlined, PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useGet, usePost, useList, useForm, useAccess } from 'react-antd-admin-panel';

const { Title, Text, Paragraph } = Typography;

const API_URL = 'https://68b566a4e5dc090291aee28b.mockapi.io/api/v1/users';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

/**
 * Hooks Demo Page
 * Demonstrates the Hooks API - a simpler alternative to the Builder pattern
 */
function HooksDemoPage() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Hooks API Demo</Title>
      <Text type="secondary">React hooks for data fetching, forms, and access control</Text>
      
      <Alert
        message="Hooks API"
        description="The Hooks API provides a more declarative, React-idiomatic way to handle common operations. 
        These hooks complement the Builder pattern (Get, Post classes) for different use cases."
        type="info"
        showIcon
        style={{ marginTop: 16, marginBottom: 24 }}
      />

      <UseGetDemo />
      <Divider />
      <UsePostDemo />
      <Divider />
      <UseListDemo />
      <Divider />
      <UseFormDemo />
      <Divider />
      <UseAccessDemo />
    </div>
  );
}

/**
 * useGet Demo - Fetching data
 */
function UseGetDemo() {
  const [userId, setUserId] = useState('1');
  
  const { data, loading, error, execute, reset } = useGet<User>({
    url: `${API_URL}/${userId}`,
    immediate: false, // Don't fetch on mount
  });

  return (
    <Card title="useGet() - Data Fetching" size="small">
      <Paragraph>
        <Text code>useGet</Text> provides reactive data fetching with loading/error states.
      </Paragraph>
      
      <Space style={{ marginBottom: 16 }}>
        <Input 
          placeholder="User ID" 
          value={userId} 
          onChange={(e) => setUserId(e.target.value)}
          style={{ width: 100 }}
        />
        <Button type="primary" onClick={() => execute()} loading={loading} icon={<ReloadOutlined />}>
          Fetch User
        </Button>
        <Button onClick={reset}>Reset</Button>
      </Space>

      {error && <Alert message={error.message} type="error" style={{ marginBottom: 16 }} />}
      
      {data && (
        <Card size="small" style={{ background: '#f5f5f5' }}>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </Card>
      )}

      <Divider plain>Code Example</Divider>
      <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4, fontSize: 12 }}>
{`const { data, loading, error, execute } = useGet<User>({
  url: '/api/users/1',
  immediate: false,  // Manual trigger
});

// In your JSX:
<Button onClick={() => execute()} loading={loading}>Fetch</Button>
{data && <div>{data.name}</div>}`}
      </pre>
    </Card>
  );
}

/**
 * usePost Demo - Mutations
 */
function UsePostDemo() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const { execute, submitting, data, error, reset } = usePost<{ name: string; email: string }, User>({
    url: API_URL,
    method: 'POST',
    onSuccess: () => {
      setName('');
      setEmail('');
    },
  });

  const handleSubmit = () => {
    if (name && email) {
      execute({ name, email });
    }
  };

  return (
    <Card title="usePost() - Mutations" size="small">
      <Paragraph>
        <Text code>usePost</Text> handles POST/PUT/PATCH/DELETE with submit state tracking.
      </Paragraph>

      <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Space>
          <Button type="primary" onClick={handleSubmit} loading={submitting} icon={<PlusOutlined />}>
            Create User
          </Button>
          <Button onClick={reset}>Reset</Button>
        </Space>
      </Space>

      {error && <Alert message={error.message} type="error" style={{ marginBottom: 16 }} />}
      
      {data && (
        <Alert message={`Created user: ${data.name} (ID: ${data.id})`} type="success" />
      )}

      <Divider plain>Code Example</Divider>
      <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4, fontSize: 12 }}>
{`const { execute, submitting, data } = usePost<CreateUserDto, User>({
  url: '/api/users',
  method: 'POST',
  onSuccess: (user) => console.log('Created:', user),
});

// Call execute with the body:
await execute({ name: 'John', email: 'john@example.com' });`}
      </pre>
    </Card>
  );
}

/**
 * useList Demo - List management
 */
function UseListDemo() {
  const { 
    data, 
    loading, 
    pagination, 
    setPagination,
    selectedRowKeys,
    setSelectedRowKeys,
    refresh,
    clearSelection,
  } = useList<User>({
    get: API_URL,
    pagination: { pageSize: 5, current: 1 },
    rowKey: 'id',
  });

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
  ];

  return (
    <Card title="useList() - List Management" size="small">
      <Paragraph>
        <Text code>useList</Text> combines data fetching with pagination, filtering, and selection.
      </Paragraph>

      <Space style={{ marginBottom: 16 }}>
        <Button onClick={refresh} icon={<ReloadOutlined />}>Refresh</Button>
        <Button onClick={clearSelection} disabled={selectedRowKeys.length === 0}>
          Clear Selection ({selectedRowKeys.length})
        </Button>
      </Space>

      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        size="small"
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total}`,
        }}
      />

      <Divider plain>Code Example</Divider>
      <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4, fontSize: 12 }}>
{`const { data, loading, pagination, setPagination, selectedRowKeys } = useList<User>({
  get: '/api/users',
  pagination: { pageSize: 10 },
  rowKey: 'id',
});

<Table
  dataSource={data}
  rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
  pagination={{ ...pagination, onChange: (p, s) => setPagination({ current: p, pageSize: s }) }}
/>`}
      </pre>
    </Card>
  );
}

/**
 * useForm Demo - Form state management
 */
function UseFormDemo() {
  const { 
    values, 
    errors, 
    setValue, 
    submit, 
    submitting, 
    reset, 
    isDirty,
    isValid,
  } = useForm<{ username: string; active: boolean }>({
    initialValues: { username: '', active: true },
    validate: (vals: { username: string; active: boolean }) => {
      const errs: Record<string, string> = {};
      if (!vals.username) errs.username = 'Username is required';
      else if (vals.username.length < 3) errs.username = 'Min 3 characters';
      return errs;
    },
    onSubmit: async (vals: { username: string; active: boolean }) => {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 1000));
      console.log('Submitted:', vals);
    },
  });

  return (
    <Card title="useForm() - Form State Management" size="small">
      <Paragraph>
        <Text code>useForm</Text> provides form state with validation, dirty tracking, and submit handling.
      </Paragraph>

      <Form layout="vertical" style={{ maxWidth: 400 }}>
        <Form.Item 
          label="Username" 
          validateStatus={errors.username ? 'error' : ''} 
          help={errors.username}
        >
          <Input 
            value={values.username} 
            onChange={(e) => setValue('username', e.target.value)}
            placeholder="Enter username"
          />
        </Form.Item>

        <Form.Item label="Active">
          <Switch 
            checked={values.active} 
            onChange={(checked) => setValue('active', checked)}
          />
        </Form.Item>

        <Space>
          <Button 
            type="primary" 
            onClick={submit} 
            loading={submitting}
            disabled={!isValid}
            icon={<CheckOutlined />}
          >
            Submit
          </Button>
          <Button onClick={reset} icon={<CloseOutlined />}>Reset</Button>
        </Space>

        <div style={{ marginTop: 12 }}>
          <Tag color={isDirty ? 'orange' : 'green'}>{isDirty ? 'Modified' : 'Clean'}</Tag>
          <Tag color={isValid ? 'green' : 'red'}>{isValid ? 'Valid' : 'Invalid'}</Tag>
        </div>
      </Form>

      <Divider plain>Code Example</Divider>
      <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4, fontSize: 12 }}>
{`const { values, errors, setValue, submit, isDirty, isValid } = useForm({
  initialValues: { username: '', active: true },
  validate: (vals) => ({
    username: vals.username.length < 3 ? 'Min 3 chars' : undefined,
  }),
  onSubmit: async (vals) => await api.save(vals),
});`}
      </pre>
    </Card>
  );
}

/**
 * useAccess Demo - Permission checking
 */
function UseAccessDemo() {
  const { 
    canAccess, 
    hasRole, 
    hasPermission,
    isAuthenticated,
    currentRole,
  } = useAccess();

  const permissionChecks = [
    { label: 'users.read', result: hasPermission('users.read') },
    { label: 'users.write', result: hasPermission('users.write') },
    { label: 'users.delete', result: hasPermission('users.delete') },
    { label: 'admin.settings', result: hasPermission('admin.settings') },
  ];

  const roleChecks = [
    { label: 'admin', result: hasRole('admin') },
    { label: 'editor', result: hasRole('editor') },
    { label: 'viewer', result: hasRole('viewer') },
  ];

  return (
    <Card title="useAccess() - Permission Checking" size="small">
      <Paragraph>
        <Text code>useAccess</Text> provides role and permission checks based on current user state.
      </Paragraph>

      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>Authentication: </Text>
          <Tag color={isAuthenticated ? 'green' : 'red'}>
            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </Tag>
        </div>

        <div>
          <Text strong>Current Role: </Text>
          <Tag color="blue">{currentRole || 'None'}</Tag>
        </div>

        <Divider plain>Permission Checks</Divider>
        <Space wrap>
          {permissionChecks.map(({ label, result }) => (
            <Tag key={label} color={result ? 'green' : 'default'}>
              {result ? <CheckOutlined /> : <CloseOutlined />} {label}
            </Tag>
          ))}
        </Space>

        <Divider plain>Role Checks</Divider>
        <Space wrap>
          {roleChecks.map(({ label, result }) => (
            <Tag key={label} color={result ? 'green' : 'default'}>
              {result ? <CheckOutlined /> : <CloseOutlined />} {label}
            </Tag>
          ))}
        </Space>

        <Divider plain>Conditional Access Example</Divider>
        {canAccess({ permissions: ['users.write'] }) ? (
          <Button type="primary" icon={<PlusOutlined />}>Add User (Visible - has permission)</Button>
        ) : (
          <Alert message="Add User button hidden - missing users.write permission" type="warning" />
        )}
      </Space>

      <Divider plain>Code Example</Divider>
      <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4, fontSize: 12 }}>
{`const { canAccess, hasRole, hasPermission, isAuthenticated } = useAccess();

// Conditional rendering:
{canAccess({ roles: ['admin'], permissions: ['users.delete'] }) && (
  <Button danger>Delete User</Button>
)}

// Or direct checks:
if (hasPermission('users.write')) {
  // Show edit controls
}`}
      </pre>
    </Card>
  );
}

export default HooksDemoPage;
