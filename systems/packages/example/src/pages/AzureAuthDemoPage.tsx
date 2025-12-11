import { Card, Descriptions, Button, Space, Alert, Spin, Avatar, Typography } from 'antd';
import { UserOutlined, SafetyCertificateOutlined, KeyOutlined } from '@ant-design/icons';
import { useAzureAuth, AzureLoginButton } from 'react-antd-admin-panel/auth';

const { Title, Text } = Typography;

/**
 * Azure Auth Demo Page
 * Demonstrates the Azure AD authentication module
 */
export default function AzureAuthDemoPage() {
  const {
    isAuthenticated,
    isLoading,
    account,
    userName,
    userEmail,
    graphProfile,
    graphLoading,
    login,
    logout,
    getAccessToken,
    fetchGraphProfile,
  } = useAzureAuth();

  const handleGetToken = async () => {
    const token = await getAccessToken();
    if (token) {
      console.log('Access token (first 50 chars):', token.substring(0, 50) + '...');
      alert('Token retrieved! Check console for details.');
    } else {
      alert('Failed to get token');
    }
  };

  const handleFetchProfile = async () => {
    const profile = await fetchGraphProfile();
    if (profile) {
      console.log('Graph Profile:', profile);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" tip="Authenticating..." />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>
        <SafetyCertificateOutlined style={{ marginRight: 8 }} />
        Azure AD Authentication Demo
      </Title>

      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
        message="Azure AD Integration"
        description={
          <span>
            This page demonstrates the <code>react-antd-admin-panel/auth</code> module.
            Configure your Azure AD app registration in the environment variables.
          </span>
        }
      />

      <Card title="Authentication Status" style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong>Status: </Text>
            {isAuthenticated ? (
              <Text type="success">Authenticated </Text>
            ) : (
              <Text type="warning">Not authenticated</Text>
            )}
          </div>

          {!isAuthenticated ? (
            <Space>
              <AzureLoginButton />
              <Button onClick={login}>Custom Login Button</Button>
            </Space>
          ) : (
            <Space>
              <AzureLoginButton />
              <Button danger onClick={logout}>Custom Logout</Button>
            </Space>
          )}
        </Space>
      </Card>

      {isAuthenticated && account && (
        <>
          <Card title="Account Information" style={{ marginBottom: 24 }}>
            <Space align="start" size="large">
              <Avatar size={64} icon={<UserOutlined />} />
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Name">{userName || '-'}</Descriptions.Item>
                <Descriptions.Item label="Email">{userEmail || '-'}</Descriptions.Item>
                <Descriptions.Item label="Username">{account.username}</Descriptions.Item>
                <Descriptions.Item label="Tenant ID">{account.tenantId}</Descriptions.Item>
                <Descriptions.Item label="Home Account ID">
                  <Text copyable style={{ fontSize: 12 }}>
                    {account.homeAccountId}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Space>
          </Card>

          <Card title="API Actions" style={{ marginBottom: 24 }}>
            <Space>
              <Button 
                icon={<KeyOutlined />} 
                onClick={handleGetToken}
              >
                Get Access Token
              </Button>
              <Button 
                icon={<UserOutlined />} 
                onClick={handleFetchProfile}
                loading={graphLoading}
              >
                Fetch Graph Profile
              </Button>
            </Space>
          </Card>

          {graphProfile && (
            <Card title="Microsoft Graph Profile">
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="Display Name">{graphProfile.displayName}</Descriptions.Item>
                <Descriptions.Item label="Email">{graphProfile.mail || '-'}</Descriptions.Item>
                <Descriptions.Item label="Job Title">{graphProfile.jobTitle || '-'}</Descriptions.Item>
                <Descriptions.Item label="Department">{graphProfile.department || '-'}</Descriptions.Item>
                <Descriptions.Item label="Office">{graphProfile.officeLocation || '-'}</Descriptions.Item>
                <Descriptions.Item label="Phone">{graphProfile.mobilePhone || '-'}</Descriptions.Item>
                <Descriptions.Item label="UPN" span={2}>{graphProfile.userPrincipalName}</Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        </>
      )}

      <Card title="Configuration" style={{ marginTop: 24 }}>
        <Alert
          type="warning"
          message="Environment Variables Required"
          description={
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li><code>VITE_AZURE_CLIENT_ID</code> - Azure AD App Client ID</li>
              <li><code>VITE_AZURE_TENANT_ID</code> - Azure AD Tenant ID</li>
              <li><code>VITE_AZURE_REDIRECT_URI</code> - Redirect URI (optional)</li>
            </ul>
          }
        />
      </Card>
    </div>
  );
}
