import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { HomeOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { MainProvider, AppLayout } from 'react-antd-admin-panel';
import type { MainConfig, MainInstance, RouteConfig } from 'react-antd-admin-panel';
import { AuthProvider, useAuth, ProtectedRoute } from './auth';
import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';

function AuthenticatedApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const appConfig: MainConfig = {
    config: {
      pathToApi: 'https://jsonplaceholder.typicode.com',
      defaultRoute: '/',
      boot: async (main: MainInstance) => {
        if (user) {
          main.User().set({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            permissions: ['users.read', 'users.write'],
          });
        }
      },
      sidebar: {
        title: '{{projectTitle}}',
        theme: 'light',
        width: 220,
      },
      profileMenu: {
        showAvatar: true,
        showLogout: true,
        onLogout: () => {
          logout();
          navigate('/login');
        },
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

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AuthenticatedApp />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}
