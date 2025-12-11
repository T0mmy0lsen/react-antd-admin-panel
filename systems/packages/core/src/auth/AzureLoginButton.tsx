import React from 'react';
import { Button, Space } from 'antd';
import { WindowsOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAzureAuth } from './useAzureAuth';

export interface AzureLoginButtonProps {
  /** Button label for login (default: "Sign in with Microsoft") */
  loginLabel?: string;
  /** Button label for logout (default: "Sign out") */
  logoutLabel?: string;
  /** Show logout button when authenticated */
  showLogout?: boolean;
  /** Button type */
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  /** Button size */
  size?: 'small' | 'middle' | 'large';
  /** Called after successful login */
  onLoginSuccess?: () => void;
  /** Called after logout */
  onLogout?: () => void;
  /** Show user name when authenticated */
  showUserName?: boolean;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/**
 * AzureLoginButton - Microsoft sign-in button component
 * 
 * @example
 * // Simple usage
 * <AzureLoginButton />
 * 
 * // With callbacks
 * <AzureLoginButton 
 *   onLoginSuccess={() => navigate('/dashboard')}
 *   onLogout={() => navigate('/login')}
 * />
 * 
 * // Customized
 * <AzureLoginButton 
 *   loginLabel="Login with Azure"
 *   type="primary"
 *   size="large"
 * />
 */
export function AzureLoginButton({
  loginLabel = 'Sign in with Microsoft',
  logoutLabel = 'Sign out',
  showLogout = true,
  type = 'default',
  size = 'middle',
  onLoginSuccess,
  onLogout,
  showUserName = true,
  className,
  style,
}: AzureLoginButtonProps): React.ReactElement {
  const { isAuthenticated, isLoading, userName, login, logout } = useAzureAuth();

  const handleLogin = async () => {
    await login();
    onLoginSuccess?.();
  };

  const handleLogout = async () => {
    await logout();
    onLogout?.();
  };

  if (isLoading) {
    return (
      <Button 
        type={type} 
        size={size} 
        loading 
        icon={<WindowsOutlined />}
        className={className}
        style={style}
      >
        Loading...
      </Button>
    );
  }

  if (isAuthenticated) {
    if (!showLogout) {
      return <></>;
    }

    return (
      <Space className={className} style={style}>
        {showUserName && userName && (
          <span style={{ marginRight: 8 }}>{userName}</span>
        )}
        <Button 
          type={type} 
          size={size} 
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          {logoutLabel}
        </Button>
      </Space>
    );
  }

  return (
    <Button 
      type={type} 
      size={size} 
      icon={<WindowsOutlined />}
      onClick={handleLogin}
      className={className}
      style={style}
    >
      {loginLabel}
    </Button>
  );
}
