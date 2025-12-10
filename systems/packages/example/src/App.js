import { jsx as _jsx } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { UserOutlined, PlusOutlined, HomeOutlined, UnorderedListOutlined, ApiOutlined, ControlOutlined, FormOutlined, CodeOutlined } from '@ant-design/icons';
import { MainProvider, AppLayout } from 'react-antd-admin-panel';
import HomePage from './pages/HomePage';
import UserListPage from './pages/UserListPage';
import AddUserPage from './pages/AddUserPage';
import AdvancedListPage from './pages/AdvancedListPage';
import HttpDemoPage from './pages/HttpDemoPage';
import MainDemoPage from './pages/MainDemoPage';
import FormControlsPage from './pages/FormControlsPage';
import HooksDemoPage from './pages/HooksDemoPage';
// Define the app configuration using Main
const appConfig = {
    config: {
        pathToApi: 'https://jsonplaceholder.typicode.com',
        defaultRoute: '/',
        boot: async (main) => {
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
            icon: _jsx(HomeOutlined, {}),
            title: 'Home',
        },
        '/users': {
            component: UserListPage,
            icon: _jsx(UserOutlined, {}),
            title: 'User List',
        },
        '/users/add': {
            component: AddUserPage,
            icon: _jsx(PlusOutlined, {}),
            title: 'Add User',
            hidden: true, // Hide from sidebar, accessible via navigation
        },
        '/form-controls': {
            component: FormControlsPage,
            icon: _jsx(FormOutlined, {}),
            title: 'Form Controls',
        },
        '/http-demo': {
            component: HttpDemoPage,
            icon: _jsx(ApiOutlined, {}),
            title: 'HTTP Models',
        },
        '/hooks-demo': {
            component: HooksDemoPage,
            icon: _jsx(CodeOutlined, {}),
            title: 'Hooks API',
        },
        '/main-demo': {
            component: MainDemoPage,
            icon: _jsx(ControlOutlined, {}),
            title: 'Main Orchestrator',
        },
        '/advanced-list': {
            component: AdvancedListPage,
            icon: _jsx(UnorderedListOutlined, {}),
            title: 'Advanced List',
        },
    },
};
function AppContent() {
    const navigate = useNavigate();
    const location = useLocation();
    return (_jsx(MainProvider, { config: appConfig, navigate: navigate, children: _jsx(AppLayout, { sections: appConfig.sections, currentPath: location.pathname, children: _jsx(Routes, { children: Object.entries(appConfig.sections).map(([path, routeConfig]) => {
                    const Component = routeConfig.component;
                    return _jsx(Route, { path: path, element: _jsx(Component, {}) }, path);
                }) }) }) }));
}
function App() {
    return (_jsx(ConfigProvider, { children: _jsx(BrowserRouter, { children: _jsx(AppContent, {}) }) }));
}
export default App;
