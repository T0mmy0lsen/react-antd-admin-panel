import React from 'react';
import { Dropdown, Avatar, Space, Typography } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { ProfileMenuConfig } from './types';
import { useMain, useUser } from './MainContext';

const { Text } = Typography;

interface ProfileMenuProps {
  config?: ProfileMenuConfig;
}

/**
 * ProfileMenu - User profile dropdown menu
 * Shows avatar, name, and configurable menu items
 */
export function ProfileMenu({ config }: ProfileMenuProps): React.ReactElement | null {
  const main = useMain();
  const user = useUser();
  const profileConfig = config || main.config.profileMenu;

  if (!user) {
    return null;
  }

  const {
    showAvatar = true,
    avatarKey = 'avatar',
    nameKey = 'name',
    emailKey = 'email',
    extraItems = [],
    onLogout,
    showLogout = true,
  } = profileConfig || {};

  const avatarUrl = user[avatarKey] as string | undefined;
  const userName = user[nameKey] as string || 'User';
  const userEmail = user[emailKey] as string | undefined;

  // Build menu items
  const menuItems: MenuProps['items'] = [];

  // User info header
  menuItems.push({
    key: '_header',
    label: React.createElement(
      Space,
      { direction: 'vertical', size: 0, style: { padding: '8px 0' } },
      React.createElement(Text, { strong: true }, userName),
      userEmail && React.createElement(Text, { type: 'secondary', style: { fontSize: 12 } }, userEmail),
    ),
    disabled: true,
  });

  menuItems.push({ type: 'divider' });

  // Extra items
  for (const item of extraItems) {
    if (item.divider) {
      menuItems.push({ type: 'divider' });
    } else {
      menuItems.push({
        key: item.key,
        label: item.label,
        icon: item.icon,
        danger: item.danger,
        onClick: item.onClick,
      });
    }
  }

  // Logout
  if (showLogout) {
    if (extraItems.length > 0) {
      menuItems.push({ type: 'divider' });
    }
    menuItems.push({
      key: '_logout',
      label: 'Logout',
      icon: React.createElement(LogoutOutlined),
      danger: true,
      onClick: async () => {
        if (onLogout) {
          await onLogout();
        }
        main.User().clear();
        if (main.config.authRoute) {
          main.navigate(main.config.authRoute);
        }
      },
    });
  }

  const avatarElement = showAvatar
    ? React.createElement(
        Avatar,
        {
          src: avatarUrl,
          icon: !avatarUrl ? React.createElement(UserOutlined) : undefined,
          style: { cursor: 'pointer' },
        },
      )
    : React.createElement(
        Space,
        { style: { cursor: 'pointer' } },
        React.createElement(UserOutlined),
        React.createElement('span', {}, userName),
      );

  return React.createElement(
    Dropdown,
    {
      menu: { items: menuItems },
      trigger: ['click'],
      placement: 'bottomRight',
    },
    avatarElement,
  );
}
