import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { MainProvider, AppLayout } from 'react-antd-admin-panel';
import type { MainConfig, MainInstance, RouteConfig } from 'react-antd-admin-panel';
import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage';

const appConfig: MainConfig = {
  config: {
    pathToApi: 'https://jsonplaceholder.typicode.com',
    defaultRoute: '/',
    boot: async (main: MainInstance) => {
      main.User().set({
        id: 1,
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'admin',
        permissions: ['users.read', 'users.write'],
      });
    },
    sidebar: {
      title: '{{projectTitle}}',
      theme: 'light',
      width: 220,
    },
    profileMenu: {
      showAvatar: true,
      showLogout: true,
      onLogout: () => console.log('Logging out...'),
    },
  },
  sections: {
    '/': {
      component: HomePage,
      icon: <HomeOutlined />,
      title: 'Home',
    },
    '/users': {
      component: UsersPage,
      icon: <UserOutlined />,
      title: 'Users',
    },
  },
};

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <MainProvider config={appConfig} navigate={navigate}>
      <AppLayout sections={appConfig.sections} currentPath={location.pathname}>
        <Routes>
          {(Object.entries(appConfig.sections) as [string, RouteConfig][]).map(([path, route]) => {
            const Component = route.component;
            return <Route key={path} path={path} element={<Component />} />;
          })}
        </Routes>
      </AppLayout>
    </MainProvider>
  );
}

export default function App() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ConfigProvider>
  );
}
