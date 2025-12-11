import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Typography, Button, Space, Card, Divider, Input, Form, Table, Tag, Alert, Switch } from 'antd';
import { ReloadOutlined, PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useGet, usePost, useList, useForm, useAccess } from 'react-antd-admin-panel';
const { Title, Text, Paragraph } = Typography;
const API_URL = 'https://68b566a4e5dc090291aee28b.mockapi.io/api/v1/users';
/**
 * Hooks Demo Page
 * Demonstrates the Hooks API - a simpler alternative to the Builder pattern
 */
function HooksDemoPage() {
    return (_jsxs("div", { style: { padding: 24 }, children: [_jsx(Title, { level: 2, children: "Hooks API Demo" }), _jsx(Text, { type: "secondary", children: "React hooks for data fetching, forms, and access control" }), _jsx(Alert, { message: "Hooks API", description: "The Hooks API provides a more declarative, React-idiomatic way to handle common operations. \r\n        These hooks complement the Builder pattern (Get, Post classes) for different use cases.", type: "info", showIcon: true, style: { marginTop: 16, marginBottom: 24 } }), _jsx(UseGetDemo, {}), _jsx(Divider, {}), _jsx(UsePostDemo, {}), _jsx(Divider, {}), _jsx(UseListDemo, {}), _jsx(Divider, {}), _jsx(UseFormDemo, {}), _jsx(Divider, {}), _jsx(UseAccessDemo, {})] }));
}
/**
 * useGet Demo - Fetching data
 */
function UseGetDemo() {
    const [userId, setUserId] = useState('1');
    const { data, loading, error, execute, reset } = useGet({
        url: `${API_URL}/${userId}`,
        immediate: false, // Don't fetch on mount
    });
    return (_jsxs(Card, { title: "useGet() - Data Fetching", size: "small", children: [_jsxs(Paragraph, { children: [_jsx(Text, { code: true, children: "useGet" }), " provides reactive data fetching with loading/error states."] }), _jsxs(Space, { style: { marginBottom: 16 }, children: [_jsx(Input, { placeholder: "User ID", value: userId, onChange: (e) => setUserId(e.target.value), style: { width: 100 } }), _jsx(Button, { type: "primary", onClick: () => execute(), loading: loading, icon: _jsx(ReloadOutlined, {}), children: "Fetch User" }), _jsx(Button, { onClick: reset, children: "Reset" })] }), error && _jsx(Alert, { message: error.message, type: "error", style: { marginBottom: 16 } }), data && (_jsx(Card, { size: "small", style: { background: '#f5f5f5' }, children: _jsx("pre", { children: JSON.stringify(data, null, 2) }) })), _jsx(Divider, { plain: true, children: "Code Example" }), _jsx("pre", { style: { background: '#f5f5f5', padding: 12, borderRadius: 4, fontSize: 12 }, children: `const { data, loading, error, execute } = useGet<User>({
  url: '/api/users/1',
  immediate: false,  // Manual trigger
});

// In your JSX:
<Button onClick={() => execute()} loading={loading}>Fetch</Button>
{data && <div>{data.name}</div>}` })] }));
}
/**
 * usePost Demo - Mutations
 */
function UsePostDemo() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const { execute, submitting, data, error, reset } = usePost({
        url: API_URL,
        method: 'POST',
        onSuccess: () => {
            setName('');
            setEmail('');
        },
    });
    const handleSubmit = () => {
        if (name && email) {
            execute({ name, email });
        }
    };
    return (_jsxs(Card, { title: "usePost() - Mutations", size: "small", children: [_jsxs(Paragraph, { children: [_jsx(Text, { code: true, children: "usePost" }), " handles POST/PUT/PATCH/DELETE with submit state tracking."] }), _jsxs(Space, { direction: "vertical", style: { width: '100%', marginBottom: 16 }, children: [_jsx(Input, { placeholder: "Name", value: name, onChange: (e) => setName(e.target.value) }), _jsx(Input, { placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value) }), _jsxs(Space, { children: [_jsx(Button, { type: "primary", onClick: handleSubmit, loading: submitting, icon: _jsx(PlusOutlined, {}), children: "Create User" }), _jsx(Button, { onClick: reset, children: "Reset" })] })] }), error && _jsx(Alert, { message: error.message, type: "error", style: { marginBottom: 16 } }), data && (_jsx(Alert, { message: `Created user: ${data.name} (ID: ${data.id})`, type: "success" })), _jsx(Divider, { plain: true, children: "Code Example" }), _jsx("pre", { style: { background: '#f5f5f5', padding: 12, borderRadius: 4, fontSize: 12 }, children: `const { execute, submitting, data } = usePost<CreateUserDto, User>({
  url: '/api/users',
  method: 'POST',
  onSuccess: (user) => console.log('Created:', user),
});

// Call execute with the body:
await execute({ name: 'John', email: 'john@example.com' });` })] }));
}
/**
 * useList Demo - List management
 */
function UseListDemo() {
    const { data, loading, pagination, setPagination, selectedRowKeys, setSelectedRowKeys, refresh, clearSelection, } = useList({
        get: API_URL,
        pagination: { pageSize: 5, current: 1 },
        rowKey: 'id',
    });
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
    ];
    return (_jsxs(Card, { title: "useList() - List Management", size: "small", children: [_jsxs(Paragraph, { children: [_jsx(Text, { code: true, children: "useList" }), " combines data fetching with pagination, filtering, and selection."] }), _jsxs(Space, { style: { marginBottom: 16 }, children: [_jsx(Button, { onClick: refresh, icon: _jsx(ReloadOutlined, {}), children: "Refresh" }), _jsxs(Button, { onClick: clearSelection, disabled: selectedRowKeys.length === 0, children: ["Clear Selection (", selectedRowKeys.length, ")"] })] }), _jsx(Table, { dataSource: data, columns: columns, loading: loading, size: "small", rowKey: "id", rowSelection: {
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                }, pagination: {
                    ...pagination,
                    onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
                    showSizeChanger: true,
                    showTotal: (total) => `Total: ${total}`,
                } }), _jsx(Divider, { plain: true, children: "Code Example" }), _jsx("pre", { style: { background: '#f5f5f5', padding: 12, borderRadius: 4, fontSize: 12 }, children: `const { data, loading, pagination, setPagination, selectedRowKeys } = useList<User>({
  get: '/api/users',
  pagination: { pageSize: 10 },
  rowKey: 'id',
});

<Table
  dataSource={data}
  rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
  pagination={{ ...pagination, onChange: (p, s) => setPagination({ current: p, pageSize: s }) }}
/>` })] }));
}
/**
 * useForm Demo - Form state management
 */
function UseFormDemo() {
    const { values, errors, setValue, submit, submitting, reset, isDirty, isValid, } = useForm({
        initialValues: { username: '', active: true },
        validate: (vals) => {
            const errs = {};
            if (!vals.username)
                errs.username = 'Username is required';
            else if (vals.username.length < 3)
                errs.username = 'Min 3 characters';
            return errs;
        },
        onSubmit: async (vals) => {
            // Simulate API call
            await new Promise((r) => setTimeout(r, 1000));
            console.log('Submitted:', vals);
        },
    });
    return (_jsxs(Card, { title: "useForm() - Form State Management", size: "small", children: [_jsxs(Paragraph, { children: [_jsx(Text, { code: true, children: "useForm" }), " provides form state with validation, dirty tracking, and submit handling."] }), _jsxs(Form, { layout: "vertical", style: { maxWidth: 400 }, children: [_jsx(Form.Item, { label: "Username", validateStatus: errors.username ? 'error' : '', help: errors.username?.message, children: _jsx(Input, { value: values.username, onChange: (e) => setValue('username', e.target.value), placeholder: "Enter username" }) }), _jsx(Form.Item, { label: "Active", children: _jsx(Switch, { checked: values.active, onChange: (checked) => setValue('active', checked) }) }), _jsxs(Space, { children: [_jsx(Button, { type: "primary", onClick: submit, loading: submitting, disabled: !isValid, icon: _jsx(CheckOutlined, {}), children: "Submit" }), _jsx(Button, { onClick: () => reset(), icon: _jsx(CloseOutlined, {}), children: "Reset" })] }), _jsxs("div", { style: { marginTop: 12 }, children: [_jsx(Tag, { color: isDirty ? 'orange' : 'green', children: isDirty ? 'Modified' : 'Clean' }), _jsx(Tag, { color: isValid ? 'green' : 'red', children: isValid ? 'Valid' : 'Invalid' })] })] }), _jsx(Divider, { plain: true, children: "Code Example" }), _jsx("pre", { style: { background: '#f5f5f5', padding: 12, borderRadius: 4, fontSize: 12 }, children: `const { values, errors, setValue, submit, isDirty, isValid } = useForm({
  initialValues: { username: '', active: true },
  validate: (vals) => ({
    username: vals.username.length < 3 ? 'Min 3 chars' : undefined,
  }),
  onSubmit: async (vals) => await api.save(vals),
});` })] }));
}
/**
 * useAccess Demo - Permission checking
 */
function UseAccessDemo() {
    const { canAccess, hasRole, hasPermission, isAuthenticated, currentRole, } = useAccess();
    const permissionChecks = [
        { label: 'users.read', result: hasPermission('users.read') },
        { label: 'users.write', result: hasPermission('users.write') },
        { label: 'users.delete', result: hasPermission('users.delete') },
        { label: 'admin.settings', result: hasPermission('admin.settings') },
    ];
    const roleChecks = [
        { label: 'admin', result: hasRole('admin') },
        { label: 'editor', result: hasRole('editor') },
        { label: 'viewer', result: hasRole('viewer') },
    ];
    return (_jsxs(Card, { title: "useAccess() - Permission Checking", size: "small", children: [_jsxs(Paragraph, { children: [_jsx(Text, { code: true, children: "useAccess" }), " provides role and permission checks based on current user state."] }), _jsxs(Space, { direction: "vertical", style: { width: '100%' }, children: [_jsxs("div", { children: [_jsx(Text, { strong: true, children: "Authentication: " }), _jsx(Tag, { color: isAuthenticated ? 'green' : 'red', children: isAuthenticated ? 'Authenticated' : 'Not Authenticated' })] }), _jsxs("div", { children: [_jsx(Text, { strong: true, children: "Current Role: " }), _jsx(Tag, { color: "blue", children: currentRole || 'None' })] }), _jsx(Divider, { plain: true, children: "Permission Checks" }), _jsx(Space, { wrap: true, children: permissionChecks.map(({ label, result }) => (_jsxs(Tag, { color: result ? 'green' : 'default', children: [result ? _jsx(CheckOutlined, {}) : _jsx(CloseOutlined, {}), " ", label] }, label))) }), _jsx(Divider, { plain: true, children: "Role Checks" }), _jsx(Space, { wrap: true, children: roleChecks.map(({ label, result }) => (_jsxs(Tag, { color: result ? 'green' : 'default', children: [result ? _jsx(CheckOutlined, {}) : _jsx(CloseOutlined, {}), " ", label] }, label))) }), _jsx(Divider, { plain: true, children: "Conditional Access Example" }), canAccess({ permissions: ['users.write'] }) ? (_jsx(Button, { type: "primary", icon: _jsx(PlusOutlined, {}), children: "Add User (Visible - has permission)" })) : (_jsx(Alert, { message: "Add User button hidden - missing users.write permission", type: "warning" }))] }), _jsx(Divider, { plain: true, children: "Code Example" }), _jsx("pre", { style: { background: '#f5f5f5', padding: 12, borderRadius: 4, fontSize: 12 }, children: `const { canAccess, hasRole, hasPermission, isAuthenticated } = useAccess();

// Conditional rendering:
{canAccess({ roles: ['admin'], permissions: ['users.delete'] }) && (
  <Button danger>Delete User</Button>
)}

// Or direct checks:
if (hasPermission('users.write')) {
  // Show edit controls
}` })] }));
}
export default HooksDemoPage;
