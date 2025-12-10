import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { 
  UserOutlined, 
  PlusOutlined, 
  HomeOutlined, 
  UnorderedListOutlined,
  ApiOutlined,
  ControlOutlined,
  FormOutlined,
  CodeOutlined
} from '@ant-design/icons';
import { MainProvider, AppLayout } from 'react-antd-admin-panel';
import type { MainConfig, MainInstance, RouteConfig } from 'react-antd-admin-panel';
import HomePage from './pages/HomePage';
import UserListPage from './pages/UserListPage';
import AddUserPage from './pages/AddUserPage';
import AdvancedListPage from './pages/AdvancedListPage';
import HttpDemoPage from './pages/HttpDemoPage';
import MainDemoPage from './pages/MainDemoPage';
import FormControlsPage from './pages/FormControlsPage';
import HooksDemoPage from './pages/HooksDemoPage';

// Define the app configuration using Main
const appConfig: MainConfig = {
  config: {
    pathToApi: 'https://jsonplaceholder.typicode.com',
    defaultRoute: '/',
    boot: async (main: MainInstance) => {
      // Simulate loading user on boot
      main.User().set({
        id: 1,
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'admin',
        permissions: ['users.read', 'users.write', 'users.delete'],
      });
    },
    sidebar: {
      title: 'Admin Panel v2',
      theme: 'light',
      width: 220,
    },
    profileMenu: {
      showAvatar: true,
      showLogout: true,
      onLogout: () => {
        console.log('Logging out...');
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
      component: UserListPage,
      icon: <UserOutlined />,
      title: 'User List',
    },
    '/users/add': {
      component: AddUserPage,
      icon: <PlusOutlined />,
      title: 'Add User',
      hidden: true, // Hide from sidebar, accessible via navigation
    },
    '/form-controls': {
      component: FormControlsPage,
      icon: <FormOutlined />,
      title: 'Form Controls',
    },
    '/http-demo': {
      component: HttpDemoPage,
      icon: <ApiOutlined />,
      title: 'HTTP Models',
    },
    '/hooks-demo': {
      component: HooksDemoPage,
      icon: <CodeOutlined />,
      title: 'Hooks API',
    },
    '/main-demo': {
      component: MainDemoPage,
      icon: <ControlOutlined />,
      title: 'Main Orchestrator',
    },
    '/advanced-list': {
      component: AdvancedListPage,
      icon: <UnorderedListOutlined />,
      title: 'Advanced List',
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
          {(Object.entries(appConfig.sections) as [string, RouteConfig][]).map(([path, routeConfig]) => {
            const Component = routeConfig.component;
            return <Route key={path} path={path} element={<Component />} />;
          })}
        </Routes>
      </AppLayout>
    </MainProvider>
  );
}

function App() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
