import React from 'react';
import { Layout, Menu } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { RouteConfig, SidebarConfig } from './types';
import { useMain, useUser } from './MainContext';
import { ProfileMenu } from './ProfileMenu';

const { Header, Sider, Content } = Layout;

interface AppLayoutProps {
  sections: Record<string, RouteConfig>;
  currentPath: string;
  sidebarConfig?: SidebarConfig;
  children: React.ReactNode;
}

/**
 * AppLayout - Main application layout with sidebar navigation
 * Renders a collapsible sidebar with menu items generated from sections
 */
export function AppLayout({ 
  sections, 
  currentPath, 
  sidebarConfig,
  children 
}: AppLayoutProps): React.ReactElement {
  const main = useMain();
  const user = useUser();
  const config = sidebarConfig || main.config.sidebar || {};

  const {
    logo,
    collapsedLogo,
    title,
    defaultCollapsed = false,
    theme = 'dark',
    width = 256,
    collapsedWidth = 80,
    footer,
  } = config;

  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  // Build menu items from sections
  const menuItems = React.useMemo((): MenuProps['items'] => {
    const items: MenuProps['items'] = [];

    for (const [path, route] of Object.entries(sections)) {
      // Skip hidden routes
      if (route.hidden) continue;

      // Check access
      if (!main.canAccess(route)) continue;

      // Handle nested routes
      if (route.children) {
        const childItems: MenuProps['items'] = [];
        for (const [childPath, childRoute] of Object.entries(route.children)) {
          if (childRoute.hidden) continue;
          if (!main.canAccess(childRoute)) continue;
          
          childItems.push({
            key: `${path}${childPath}`,
            label: childRoute.title,
            icon: childRoute.icon,
          });
        }

        if (childItems.length > 0) {
          items.push({
            key: path,
            label: route.title,
            icon: route.icon,
            children: childItems,
          });
        }
      } else {
        items.push({
          key: path,
          label: route.title,
          icon: route.icon,
        });
      }
    }

    return items;
  }, [sections, main]);

  // Handle menu click
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    main.navigate(key);
  };

  // Determine selected keys
  const selectedKeys = [currentPath];
  const openKeys = Object.keys(sections).filter(path => {
    const section = sections[path];
    return currentPath.startsWith(path) && section && section.children;
  });

  // Render logo
  const renderLogo = () => {
    const logoContent = collapsed ? collapsedLogo || logo : logo;
    
    if (!logoContent) return null;

    const logoElement = typeof logoContent === 'string'
      ? React.createElement('img', { 
          src: logoContent, 
          alt: 'Logo',
          style: { height: 32, objectFit: 'contain' },
        })
      : logoContent;

    return React.createElement(
      'div',
      {
        style: {
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? 0 : '0 16px',
          gap: 12,
        },
      },
      logoElement,
      !collapsed && title && React.createElement(
        'span',
        { 
          style: { 
            color: theme === 'dark' ? '#fff' : '#000',
            fontSize: 18,
            fontWeight: 600,
            whiteSpace: 'nowrap',
          },
        },
        title,
      ),
    );
  };

  return React.createElement(
    Layout,
    { style: { minHeight: '100vh' } },
    // Sidebar
    React.createElement(
      Sider,
      {
        collapsible: true,
        collapsed,
        onCollapse: setCollapsed,
        theme,
        width,
        collapsedWidth,
        trigger: null,
        style: {
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        },
      },
      renderLogo(),
      React.createElement(
        Menu,
        {
          theme,
          mode: 'inline',
          selectedKeys,
          defaultOpenKeys: openKeys,
          items: menuItems,
          onClick: handleMenuClick,
        },
      ),
      footer && React.createElement(
        'div',
        {
          style: {
            position: 'absolute',
            bottom: 48,
            left: 0,
            right: 0,
            padding: '0 16px',
          },
        },
        footer,
      ),
    ),
    // Main content area
    React.createElement(
      Layout,
      {
        style: {
          marginLeft: collapsed ? collapsedWidth : width,
          transition: 'margin-left 0.2s',
        },
      },
      // Header
      React.createElement(
        Header,
        {
          style: {
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          },
        },
        // Collapse trigger
        React.createElement(
          'div',
          {
            onClick: () => setCollapsed(!collapsed),
            style: { cursor: 'pointer', fontSize: 18 },
          },
          React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined),
        ),
        // Profile menu
        user && React.createElement(ProfileMenu, {}),
      ),
      // Content
      React.createElement(
        Content,
        {
          style: {
            margin: 24,
            padding: 24,
            background: '#fff',
            minHeight: 280,
            borderRadius: 8,
          },
        },
        children,
      ),
    ),
  );
}
