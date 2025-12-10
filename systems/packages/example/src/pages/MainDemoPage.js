import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
        .add(_jsxs(Paragraph, { children: ["The ", _jsx(Text, { code: true, children: "Main" }), " orchestrator is the central control point for the application. It manages user authentication state, global store, routing, and access control. Access it via ", _jsx(Text, { code: true, children: "useMain()" }), ", ", _jsx(Text, { code: true, children: "useUser()" }), ", and ", _jsx(Text, { code: true, children: "useStore()" }), " hooks."] }));
    // User State section
    const userSection = new Section()
        .card({ title: 'User State (useUser)' })
        .add(_jsx(_Fragment, { children: _jsxs(Space, { direction: "vertical", style: { width: '100%' }, children: [_jsxs("div", { children: [_jsx(Text, { strong: true, children: "Current User:" }), _jsx("pre", { style: { background: '#f5f5f5', padding: 12, borderRadius: 4, marginTop: 8 }, children: JSON.stringify(currentUser, null, 2) })] }), _jsx(Divider, {}), _jsxs("div", { children: [_jsx(Text, { strong: true, children: "Helper Methods:" }), _jsxs("div", { style: { marginTop: 8 }, children: [_jsxs(Tag, { color: userState.isAuthenticated() ? 'green' : 'red', children: ["isAuthenticated(): ", String(userState.isAuthenticated())] }), _jsxs(Tag, { color: userState.hasRole('admin') ? 'green' : 'default', children: ["hasRole('admin'): ", String(userState.hasRole('admin'))] }), _jsxs(Tag, { color: userState.hasPermission('users.write') ? 'green' : 'default', children: ["hasPermission('users.write'): ", String(userState.hasPermission('users.write'))] })] })] }), _jsx(Divider, {}), _jsxs("div", { children: [_jsx(Text, { strong: true, children: "Update User:" }), _jsxs(Space, { style: { marginTop: 8 }, children: [_jsx(Button, { onClick: () => userState.set({ ...currentUser, role: 'admin' }), disabled: userRole === 'admin', children: "Set Admin Role" }), _jsx(Button, { onClick: () => userState.set({ ...currentUser, role: 'user' }), disabled: userRole === 'user', children: "Set User Role" }), _jsx(Button, { onClick: () => userState.set({ ...currentUser, role: 'guest' }), disabled: userRole === 'guest', children: "Set Guest Role" }), _jsx(Button, { danger: true, onClick: () => userState.clear(), icon: _jsx(LogoutOutlined, {}), children: "Clear User (Logout)" })] })] })] }) }));
    // Store section
    const storeSection = new Section()
        .card({ title: 'Global Store (useStore)' })
        .add(_jsx(_Fragment, { children: _jsxs(Space, { direction: "vertical", style: { width: '100%' }, children: [_jsx(Text, { strong: true, children: "Current Store Contents:" }), _jsx("pre", { style: { background: '#f5f5f5', padding: 12, borderRadius: 4 }, children: JSON.stringify(store.keys().reduce((acc, key) => {
                        acc[key] = store.get(key);
                        return acc;
                    }, {}), null, 2) || '{}' }), _jsx(Divider, {}), _jsx(Text, { strong: true, children: "Add to Store:" }), _jsxs(Space, { children: [_jsx(AntInput, { placeholder: "Key", value: storeKey, onChange: (e) => setStoreKey(e.target.value), style: { width: 120 } }), _jsx(AntInput, { placeholder: "Value", value: storeValue, onChange: (e) => setStoreValue(e.target.value), style: { width: 150 } }), _jsx(Button, { type: "primary", onClick: () => {
                                if (storeKey) {
                                    store.set(storeKey, storeValue);
                                    setStoreKey('');
                                    setStoreValue('');
                                }
                            }, children: "Set Value" })] }), _jsxs(Space, { style: { marginTop: 8 }, children: [_jsx(Button, { onClick: () => store.set('theme', 'dark'), children: "Set theme = \"dark\"" }), _jsx(Button, { onClick: () => store.set('features', ['dashboard', 'users', 'reports']), children: "Set features array" }), _jsx(Button, { danger: true, onClick: () => store.clear(), children: "Clear Store" })] })] }) }));
    // Protected components section
    const protectedSection = new Section()
        .card({ title: 'Protected Components' })
        .add(_jsxs(_Fragment, { children: [_jsxs(Paragraph, { children: ["Use ", _jsx(Text, { code: true, children: '<Protected>' }), " to conditionally render content based on roles or permissions."] }), _jsx(Divider, {}), _jsx(Text, { strong: true, children: "Role-Based Protection:" }), _jsxs("div", { style: { marginTop: 8, display: 'flex', gap: 16 }, children: [_jsxs(Card, { size: "small", title: "Admin Only", style: { flex: 1 }, children: [_jsx(Protected, { role: "admin", children: _jsx(Alert, { type: "success", message: "\u2713 You can see this (admin role)" }) }), _jsx(Protected, { role: "admin", fallback: _jsx(Alert, { type: "warning", message: "Admin access required" }), children: _jsx("span", {}) })] }), _jsxs(Card, { size: "small", title: "User Only", style: { flex: 1 }, children: [_jsx(Protected, { role: "user", children: _jsx(Alert, { type: "success", message: "\u2713 You can see this (user role)" }) }), _jsx(Protected, { role: "user", fallback: _jsx(Alert, { type: "warning", message: "User access required" }), children: _jsx("span", {}) })] }), _jsxs(Card, { size: "small", title: "Guest Only", style: { flex: 1 }, children: [_jsx(Protected, { role: "guest", children: _jsx(Alert, { type: "success", message: "\u2713 You can see this (guest role)" }) }), _jsx(Protected, { role: "guest", fallback: _jsx(Alert, { type: "warning", message: "Guest access required" }), children: _jsx("span", {}) })] })] }), _jsx(Divider, {}), _jsx(Text, { strong: true, children: "Permission-Based Protection:" }), _jsxs("div", { style: { marginTop: 8, display: 'flex', gap: 16 }, children: [_jsxs(Card, { size: "small", title: "users.write", style: { flex: 1 }, children: [_jsx(Protected, { permissions: ['users.write'], children: _jsx(Alert, { type: "success", message: "\u2713 Has users.write permission" }) }), _jsx(Protected, { permissions: ['users.write'], fallback: _jsx(Alert, { type: "error", message: "Missing permission" }), children: _jsx("span", {}) })] }), _jsxs(Card, { size: "small", title: "users.delete", style: { flex: 1 }, children: [_jsx(Protected, { permissions: ['users.delete'], children: _jsx(Alert, { type: "success", message: "\u2713 Has users.delete permission" }) }), _jsx(Protected, { permissions: ['users.delete'], fallback: _jsx(Alert, { type: "error", message: "Missing permission" }), children: _jsx("span", {}) })] }), _jsxs(Card, { size: "small", title: "reports.view", style: { flex: 1 }, children: [_jsx(Protected, { permissions: ['reports.view'], children: _jsx(Alert, { type: "success", message: "\u2713 Has reports.view permission" }) }), _jsx(Protected, { permissions: ['reports.view'], fallback: _jsx(Alert, { type: "error", message: "Missing permission" }), children: _jsx("span", {}) })] })] }), _jsx(Divider, {}), _jsx(Text, { strong: true, children: "Current Status:" }), _jsxs("div", { style: { marginTop: 8 }, children: [_jsxs(Tag, { icon: _jsx(UserOutlined, {}), children: ["Role: ", userRole] }), userPermissions.map((perm) => (_jsx(Tag, { icon: _jsx(LockOutlined, {}), color: "blue", children: perm }, perm)))] })] }));
    // Navigation section
    const navigationSection = new Section()
        .card({ title: 'Main Instance Methods' })
        .add(_jsx(_Fragment, { children: _jsxs(Space, { direction: "vertical", style: { width: '100%' }, children: [_jsx(Text, { strong: true, children: "Navigation:" }), _jsxs(Space, { children: [_jsx(Button, { onClick: () => main.navigate('/'), children: "Navigate to Home" }), _jsx(Button, { onClick: () => main.navigate('/users'), children: "Navigate to Users" })] }), _jsx(Divider, {}), _jsx(Text, { strong: true, children: "Access Check:" }), _jsxs("div", { children: [_jsxs(Tag, { color: main.canAccess({ requiredRole: 'admin', title: '', component: () => null }) ? 'green' : 'red', children: ["canAccess(admin): ", String(main.canAccess({ requiredRole: 'admin', title: '', component: () => null }))] }), _jsxs(Tag, { color: main.canAccess({ requiredPermissions: ['users.read'], title: '', component: () => null }) ? 'green' : 'red', children: ["canAccess(users.read): ", String(main.canAccess({ requiredPermissions: ['users.read'], title: '', component: () => null }))] })] }), _jsx(Divider, {}), _jsx(Text, { strong: true, children: "Configuration:" }), _jsx("pre", { style: { background: '#f5f5f5', padding: 12, borderRadius: 4 }, children: JSON.stringify({
                        pathToApi: main.config.pathToApi,
                        defaultRoute: main.config.defaultRoute,
                    }, null, 2) })] }) }));
    return (_jsxs("div", { style: { padding: 24 }, children: [_jsx(Title, { level: 2, children: "Main Orchestrator Demo" }), _jsx(Text, { type: "secondary", children: "Demonstrating User state, Global Store, and Protected components" }), _jsx("div", { style: { marginTop: 24 }, children: infoSection.render() }), _jsxs("div", { style: { display: 'flex', gap: 24, marginTop: 24 }, children: [_jsx("div", { style: { flex: 1 }, children: userSection.render() }), _jsx("div", { style: { flex: 1 }, children: storeSection.render() })] }), _jsx("div", { style: { marginTop: 24 }, children: protectedSection.render() }), _jsx("div", { style: { marginTop: 24 }, children: navigationSection.render() })] }));
}
export default MainDemoPage;
