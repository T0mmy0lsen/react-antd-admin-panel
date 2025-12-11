import { useState } from 'react';
import { Typography, Button, Space, Divider, Input as AntInput, message, Alert } from 'antd';
import { SendOutlined, ReloadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Get, Post, Section } from 'react-antd-admin-panel';

const { Title, Text, Paragraph } = Typography;

const API_URL = 'https://68b566a4e5dc090291aee28b.mockapi.io/api/v1/users';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt?: string;
}

/**
 * HTTP Demo Page
 * Demonstrates Get and Post HTTP builders with all their features
 */
function HttpDemoPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Example 1: Basic GET request
  const handleBasicGet = async () => {
    setLoading(true);
    setError(null);
    setResult('');

    await new Get<User[]>()
      .target(API_URL)
      .params({ page: 1, limit: 5 })
      .onThen((users: User[]) => {
        setResult(JSON.stringify(users, null, 2));
        message.success(`Loaded ${users.length} users`);
      })
      .onCatch((err: Error) => {
        setError(err.message);
        message.error('Failed to load users');
      })
      .onFinally(() => {
        setLoading(false);
      })
      .execute();
  };

  // Example 2: GET with custom headers
  const handleGetWithHeaders = async () => {
    setLoading(true);
    setError(null);

    await new Get<User>()
      .target(`${API_URL}/1`)
      .headers({ 
        'X-Custom-Header': 'demo-value',
        'Accept': 'application/json'
      })
      .onThen((user: User) => {
        setResult(JSON.stringify(user, null, 2));
        message.success(`Loaded user: ${user.name}`);
      })
      .onCatch((err: Error) => {
        setError(err.message);
      })
      .onFinally(() => setLoading(false))
      .execute();
  };

  // Example 3: POST - Create new user
  const handlePost = async () => {
    if (!userName || !userEmail) {
      message.warning('Please enter name and email');
      return;
    }

    setLoading(true);
    setError(null);

    await new Post<Omit<User, 'id'>, User>()
      .target(API_URL)
      .body({
        name: userName,
        email: userEmail,
        avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
        createdAt: new Date().toISOString(),
      })
      .onThen((user: User) => {
        setResult(JSON.stringify(user, null, 2));
        message.success(`Created user: ${user.name} (ID: ${user.id})`);
        setUserName('');
        setUserEmail('');
      })
      .onCatch((err: Error) => {
        setError(err.message);
        message.error('Failed to create user');
      })
      .onFinally(() => setLoading(false))
      .execute();
  };

  // Example 4: PUT - Update user
  const handlePut = async () => {
    setLoading(true);
    setError(null);

    await new Post<Partial<User>, User>()
      .target(`${API_URL}/1`)
      .method('PUT')
      .body({
        name: 'Updated User Name',
        email: 'updated@example.com',
      })
      .onThen((user: User) => {
        setResult(JSON.stringify(user, null, 2));
        message.success('User updated successfully');
      })
      .onCatch((err: Error) => {
        setError(err.message);
      })
      .onFinally(() => setLoading(false))
      .execute();
  };

  // Example 5: DELETE
  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    await new Post<void>()
      .target(`${API_URL}/999`)
      .method('DELETE')
      .onThen(() => {
        setResult('User deleted successfully');
        message.success('User deleted');
      })
      .onCatch((err: Error) => {
        setError(err.message);
      })
      .onFinally(() => setLoading(false))
      .execute();
  };

  // Info section
  const infoSection = new Section()
    .card({ title: 'About HTTP Models' })
    .add(
      <Paragraph>
        The <Text code>Get</Text> and <Text code>Post</Text> builders provide a fluent API for making HTTP requests.
        They support params, headers, body, and lifecycle callbacks (<Text code>onThen</Text>, <Text code>onCatch</Text>, <Text code>onFinally</Text>).
      </Paragraph>
    );

  // GET Examples section
  const getExamples = new Section()
    .card({ title: 'GET Requests' })
    .add(
      <>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>Basic GET with params:</Text>
          <Text type="secondary" code>
            {`new Get<User[]>().target('/api/users').params({ page: 1 }).execute()`}
          </Text>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={handleBasicGet}
            loading={loading}
          >
            Fetch Users (GET)
          </Button>
          
          <Divider />
          
          <Text strong>GET with custom headers:</Text>
          <Text type="secondary" code>
            {`new Get<User>().target('/api/users/1').headers({ 'X-Custom': 'value' }).execute()`}
          </Text>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleGetWithHeaders}
            loading={loading}
          >
            Fetch Single User with Headers
          </Button>
        </Space>
      </>
    );

  // POST Examples section
  const postExamples = new Section()
    .card({ title: 'POST/PUT/DELETE Requests' })
    .add(
      <>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>POST - Create new user:</Text>
          <Space>
            <AntInput 
              placeholder="Name" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{ width: 150 }}
            />
            <AntInput 
              placeholder="Email" 
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              style={{ width: 200 }}
            />
            <Button 
              type="primary" 
              icon={<SendOutlined />}
              onClick={handlePost}
              loading={loading}
            >
              Create User (POST)
            </Button>
          </Space>

          <Divider />

          <Text strong>PUT - Update user #1:</Text>
          <Button 
            icon={<EditOutlined />}
            onClick={handlePut}
            loading={loading}
          >
            Update User (PUT)
          </Button>

          <Divider />

          <Text strong>DELETE - Remove user:</Text>
          <Button 
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            loading={loading}
          >
            Delete User (DELETE)
          </Button>
        </Space>
      </>
    );

  // Results section
  const resultsSection = new Section()
    .card({ title: 'Response' })
    .add(
      <>
        {error && (
          <Alert 
            type="error" 
            message="Error" 
            description={error} 
            style={{ marginBottom: 16 }}
          />
        )}
        {result && (
          <pre style={{ 
            background: '#f5f5f5', 
            padding: 16, 
            borderRadius: 8,
            maxHeight: 300,
            overflow: 'auto',
            fontSize: 12
          }}>
            {result}
          </pre>
        )}
        {!result && !error && (
          <Text type="secondary">Click a button above to see the response</Text>
        )}
      </>
    );

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>HTTP Models Demo</Title>
      <Text type="secondary">
        Demonstrating Get and Post HTTP builders with lifecycle callbacks
      </Text>

      <div style={{ marginTop: 24 }}>
        {infoSection.render()}
      </div>

      <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
        <div style={{ flex: 1 }}>
          {getExamples.render()}
          <div style={{ marginTop: 16 }}>
            {postExamples.render()}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          {resultsSection.render()}
        </div>
      </div>
    </div>
  );
}

export default HttpDemoPage;
