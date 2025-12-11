import { Typography, Button, Space, Card, Divider, Input as AntInput, Tag, Alert } from 'antd';
import { UserOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons';
import { Section, useMain, Protected } from 'react-antd-admin-panel';
import { useState, useEffect } from 'react';

const { Title, Text, Paragraph } = Typography;

/**
 * Main Orchestrator Demo Page
 * Demonstrates User state, Store, and Protected components
 */
function MainDemoPage() {
  const main = useMain();
  const userState = main.User();
  const store = main.Store();
  
  const [storeKey, setStoreKey] = useState('');
  const [storeValue, setStoreValue] = useState('');
  const [, forceUpdate] = useState(0);

  // Subscribe to user changes to re-render
  useEffect(() => {
    return userState.subscribe(() => forceUpdate(n => n + 1));
  }, [userState]);

  // Get current user data
  const currentUser = userState.get();
  const userRole = currentUser?.role || 'none';
  const userPermissions = currentUser?.permissions || [];

  // Info section about Main
  const infoSection = new Section()
    .card({ title: 'About Main Orchestrator' })
    .add(
      <Paragraph>
        The <Text code>Main</Text> orchestrator is the central control point for the application.
        It manages user authentication state, global store, routing, and access control.
        Access it via <Text code>useMain()</Text>, <Text code>useUser()</Text>, and <Text code>useStore()</Text> hooks.
      </Paragraph>
    );

  // User State section
  const userSection = new Section()
    .card({ title: 'User State (useUser)' })
    .add(
      <>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>Current User:</Text>
            <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4, marginTop: 8 }}>
              {JSON.stringify(currentUser, null, 2)}
            </pre>
          </div>

          <Divider />

          <div>
            <Text strong>Helper Methods:</Text>
            <div style={{ marginTop: 8 }}>
              <Tag color={userState.isAuthenticated() ? 'green' : 'red'}>
                isAuthenticated(): {String(userState.isAuthenticated())}
              </Tag>
              <Tag color={userState.hasRole('admin') ? 'green' : 'default'}>
                hasRole('admin'): {String(userState.hasRole('admin'))}
              </Tag>
              <Tag color={userState.hasPermission('users.write') ? 'green' : 'default'}>
                hasPermission('users.write'): {String(userState.hasPermission('users.write'))}
              </Tag>
            </div>
          </div>

          <Divider />

          <div>
            <Text strong>Update User:</Text>
            <Space style={{ marginTop: 8 }}>
              <Button 
                onClick={() => currentUser && userState.set({ ...currentUser, role: 'admin' })}
                disabled={userRole === 'admin'}
              >
                Set Admin Role
              </Button>
              <Button 
                onClick={() => currentUser && userState.set({ ...currentUser, role: 'user' })}
                disabled={userRole === 'user'}
              >
                Set User Role
              </Button>
              <Button 
                onClick={() => currentUser && userState.set({ ...currentUser, role: 'guest' })}
                disabled={userRole === 'guest'}
              >
                Set Guest Role
              </Button>
              <Button 
                danger
                onClick={() => userState.clear()}
                icon={<LogoutOutlined />}
              >
                Clear User (Logout)
              </Button>
            </Space>
          </div>
        </Space>
      </>
    );

  // Store section
  const storeSection = new Section()
    .card({ title: 'Global Store (useStore)' })
    .add(
      <>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>Current Store Contents:</Text>
          <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
            {JSON.stringify(
              store.keys().reduce((acc: Record<string, unknown>, key: string) => {
                acc[key] = store.get(key);
                return acc;
              }, {}),
              null, 2
            ) || '{}'}
          </pre>

          <Divider />

          <Text strong>Add to Store:</Text>
          <Space>
            <AntInput 
              placeholder="Key" 
              value={storeKey}
              onChange={(e) => setStoreKey(e.target.value)}
              style={{ width: 120 }}
            />
            <AntInput 
              placeholder="Value" 
              value={storeValue}
              onChange={(e) => setStoreValue(e.target.value)}
              style={{ width: 150 }}
            />
            <Button 
              type="primary"
              onClick={() => {
                if (storeKey) {
                  store.set(storeKey, storeValue);
                  setStoreKey('');
                  setStoreValue('');
                }
              }}
            >
              Set Value
            </Button>
          </Space>

          <Space style={{ marginTop: 8 }}>
            <Button 
              onClick={() => store.set('theme', 'dark')}
            >
              Set theme = "dark"
            </Button>
            <Button 
              onClick={() => store.set('features', ['dashboard', 'users', 'reports'])}
            >
              Set features array
            </Button>
            <Button 
              danger
              onClick={() => store.clear()}
            >
              Clear Store
            </Button>
          </Space>
        </Space>
      </>
    );

  // Protected components section
  const protectedSection = new Section()
    .card({ title: 'Protected Components' })
    .add(
      <>
        <Paragraph>
          Use <Text code>{'<Protected>'}</Text> to conditionally render content based on roles or permissions.
        </Paragraph>

        <Divider />

        <Text strong>Role-Based Protection:</Text>
        <div style={{ marginTop: 8, display: 'flex', gap: 16 }}>
          <Card size="small" title="Admin Only" style={{ flex: 1 }}>
            <Protected role="admin">
              <Alert type="success" message="✓ You can see this (admin role)" />
            </Protected>
            <Protected role="admin" fallback={<Alert type="warning" message="Admin access required" />}>
              <span />
            </Protected>
          </Card>

          <Card size="small" title="User Only" style={{ flex: 1 }}>
            <Protected role="user">
              <Alert type="success" message="✓ You can see this (user role)" />
            </Protected>
            <Protected role="user" fallback={<Alert type="warning" message="User access required" />}>
              <span />
            </Protected>
          </Card>

          <Card size="small" title="Guest Only" style={{ flex: 1 }}>
            <Protected role="guest">
              <Alert type="success" message="✓ You can see this (guest role)" />
            </Protected>
            <Protected role="guest" fallback={<Alert type="warning" message="Guest access required" />}>
              <span />
            </Protected>
          </Card>
        </div>

        <Divider />

        <Text strong>Permission-Based Protection:</Text>
        <div style={{ marginTop: 8, display: 'flex', gap: 16 }}>
          <Card size="small" title="users.write" style={{ flex: 1 }}>
            <Protected permissions={['users.write']}>
              <Alert type="success" message="✓ Has users.write permission" />
            </Protected>
            <Protected permissions={['users.write']} fallback={<Alert type="error" message="Missing permission" />}>
              <span />
            </Protected>
          </Card>

          <Card size="small" title="users.delete" style={{ flex: 1 }}>
            <Protected permissions={['users.delete']}>
              <Alert type="success" message="✓ Has users.delete permission" />
            </Protected>
            <Protected permissions={['users.delete']} fallback={<Alert type="error" message="Missing permission" />}>
              <span />
            </Protected>
          </Card>

          <Card size="small" title="reports.view" style={{ flex: 1 }}>
            <Protected permissions={['reports.view']}>
              <Alert type="success" message="✓ Has reports.view permission" />
            </Protected>
            <Protected permissions={['reports.view']} fallback={<Alert type="error" message="Missing permission" />}>
              <span />
            </Protected>
          </Card>
        </div>

        <Divider />

        <Text strong>Current Status:</Text>
        <div style={{ marginTop: 8 }}>
          <Tag icon={<UserOutlined />}>Role: {userRole}</Tag>
          {userPermissions.map((perm: string) => (
            <Tag key={perm} icon={<LockOutlined />} color="blue">{perm}</Tag>
          ))}
        </div>
      </>
    );

  // Navigation section
  const navigationSection = new Section()
    .card({ title: 'Main Instance Methods' })
    .add(
      <>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>Navigation:</Text>
          <Space>
            <Button onClick={() => main.navigate('/')}>Navigate to Home</Button>
            <Button onClick={() => main.navigate('/users')}>Navigate to Users</Button>
          </Space>

          <Divider />

          <Text strong>Access Check:</Text>
          <div>
            <Tag color={main.canAccess({ requiredRole: 'admin', title: '', component: () => null }) ? 'green' : 'red'}>
              canAccess(admin): {String(main.canAccess({ requiredRole: 'admin', title: '', component: () => null }))}
            </Tag>
            <Tag color={main.canAccess({ requiredPermissions: ['users.read'], title: '', component: () => null }) ? 'green' : 'red'}>
              canAccess(users.read): {String(main.canAccess({ requiredPermissions: ['users.read'], title: '', component: () => null }))}
            </Tag>
          </div>

          <Divider />

          <Text strong>Configuration:</Text>
          <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
            {JSON.stringify({
              pathToApi: main.config.pathToApi,
              defaultRoute: main.config.defaultRoute,
            }, null, 2)}
          </pre>
        </Space>
      </>
    );

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Main Orchestrator Demo</Title>
      <Text type="secondary">
        Demonstrating User state, Global Store, and Protected components
      </Text>

      <div style={{ marginTop: 24 }}>
        {infoSection.render()}
      </div>

      <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
        <div style={{ flex: 1 }}>
          {userSection.render()}
        </div>
        <div style={{ flex: 1 }}>
          {storeSection.render()}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        {protectedSection.render()}
      </div>

      <div style={{ marginTop: 24 }}>
        {navigationSection.render()}
      </div>
    </div>
  );
}

export default MainDemoPage;
