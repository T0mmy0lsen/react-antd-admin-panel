import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Typography, Button, Space, Divider, Input as AntInput, message, Alert } from 'antd';
import { SendOutlined, ReloadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Get, Post, Section } from 'react-antd-admin-panel';
const { Title, Text, Paragraph } = Typography;
const API_URL = 'https://68b566a4e5dc090291aee28b.mockapi.io/api/v1/users';
/**
 * HTTP Demo Page
 * Demonstrates Get and Post HTTP builders with all their features
 */
function HttpDemoPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    // Example 1: Basic GET request
    const handleBasicGet = async () => {
        setLoading(true);
        setError(null);
        setResult('');
        await new Get()
            .target(API_URL)
            .params({ page: 1, limit: 5 })
            .onThen((users) => {
            setResult(JSON.stringify(users, null, 2));
            message.success(`Loaded ${users.length} users`);
        })
            .onCatch((err) => {
            setError(err.message);
            message.error('Failed to load users');
        })
            .onFinally(() => {
            setLoading(false);
        })
            .execute();
    };
    // Example 2: GET with custom headers
    const handleGetWithHeaders = async () => {
        setLoading(true);
        setError(null);
        await new Get()
            .target(`${API_URL}/1`)
            .headers({
            'X-Custom-Header': 'demo-value',
            'Accept': 'application/json'
        })
            .onThen((user) => {
            setResult(JSON.stringify(user, null, 2));
            message.success(`Loaded user: ${user.name}`);
        })
            .onCatch((err) => {
            setError(err.message);
        })
            .onFinally(() => setLoading(false))
            .execute();
    };
    // Example 3: POST - Create new user
    const handlePost = async () => {
        if (!userName || !userEmail) {
            message.warning('Please enter name and email');
            return;
        }
        setLoading(true);
        setError(null);
        await new Post()
            .target(API_URL)
            .body({
            name: userName,
            email: userEmail,
            avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
            createdAt: new Date().toISOString(),
        })
            .onThen((user) => {
            setResult(JSON.stringify(user, null, 2));
            message.success(`Created user: ${user.name} (ID: ${user.id})`);
            setUserName('');
            setUserEmail('');
        })
            .onCatch((err) => {
            setError(err.message);
            message.error('Failed to create user');
        })
            .onFinally(() => setLoading(false))
            .execute();
    };
    // Example 4: PUT - Update user
    const handlePut = async () => {
        setLoading(true);
        setError(null);
        await new Post()
            .target(`${API_URL}/1`)
            .method('PUT')
            .body({
            name: 'Updated User Name',
            email: 'updated@example.com',
        })
            .onThen((user) => {
            setResult(JSON.stringify(user, null, 2));
            message.success('User updated successfully');
        })
            .onCatch((err) => {
            setError(err.message);
        })
            .onFinally(() => setLoading(false))
            .execute();
    };
    // Example 5: DELETE
    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        await new Post()
            .target(`${API_URL}/999`)
            .method('DELETE')
            .onThen(() => {
            setResult('User deleted successfully');
            message.success('User deleted');
        })
            .onCatch((err) => {
            setError(err.message);
        })
            .onFinally(() => setLoading(false))
            .execute();
    };
    // Info section
    const infoSection = new Section()
        .card({ title: 'About HTTP Models' })
        .add(_jsxs(Paragraph, { children: ["The ", _jsx(Text, { code: true, children: "Get" }), " and ", _jsx(Text, { code: true, children: "Post" }), " builders provide a fluent API for making HTTP requests. They support params, headers, body, and lifecycle callbacks (", _jsx(Text, { code: true, children: "onThen" }), ", ", _jsx(Text, { code: true, children: "onCatch" }), ", ", _jsx(Text, { code: true, children: "onFinally" }), ")."] }));
    // GET Examples section
    const getExamples = new Section()
        .card({ title: 'GET Requests' })
        .add(_jsx(_Fragment, { children: _jsxs(Space, { direction: "vertical", style: { width: '100%' }, children: [_jsx(Text, { strong: true, children: "Basic GET with params:" }), _jsx(Text, { type: "secondary", code: true, children: `new Get<User[]>().target('/api/users').params({ page: 1 }).execute()` }), _jsx(Button, { type: "primary", icon: _jsx(ReloadOutlined, {}), onClick: handleBasicGet, loading: loading, children: "Fetch Users (GET)" }), _jsx(Divider, {}), _jsx(Text, { strong: true, children: "GET with custom headers:" }), _jsx(Text, { type: "secondary", code: true, children: `new Get<User>().target('/api/users/1').headers({ 'X-Custom': 'value' }).execute()` }), _jsx(Button, { icon: _jsx(ReloadOutlined, {}), onClick: handleGetWithHeaders, loading: loading, children: "Fetch Single User with Headers" })] }) }));
    // POST Examples section
    const postExamples = new Section()
        .card({ title: 'POST/PUT/DELETE Requests' })
        .add(_jsx(_Fragment, { children: _jsxs(Space, { direction: "vertical", style: { width: '100%' }, children: [_jsx(Text, { strong: true, children: "POST - Create new user:" }), _jsxs(Space, { children: [_jsx(AntInput, { placeholder: "Name", value: userName, onChange: (e) => setUserName(e.target.value), style: { width: 150 } }), _jsx(AntInput, { placeholder: "Email", value: userEmail, onChange: (e) => setUserEmail(e.target.value), style: { width: 200 } }), _jsx(Button, { type: "primary", icon: _jsx(SendOutlined, {}), onClick: handlePost, loading: loading, children: "Create User (POST)" })] }), _jsx(Divider, {}), _jsx(Text, { strong: true, children: "PUT - Update user #1:" }), _jsx(Button, { icon: _jsx(EditOutlined, {}), onClick: handlePut, loading: loading, children: "Update User (PUT)" }), _jsx(Divider, {}), _jsx(Text, { strong: true, children: "DELETE - Remove user:" }), _jsx(Button, { danger: true, icon: _jsx(DeleteOutlined, {}), onClick: handleDelete, loading: loading, children: "Delete User (DELETE)" })] }) }));
    // Results section
    const resultsSection = new Section()
        .card({ title: 'Response' })
        .add(_jsxs(_Fragment, { children: [error && (_jsx(Alert, { type: "error", message: "Error", description: error, style: { marginBottom: 16 } })), result && (_jsx("pre", { style: {
                    background: '#f5f5f5',
                    padding: 16,
                    borderRadius: 8,
                    maxHeight: 300,
                    overflow: 'auto',
                    fontSize: 12
                }, children: result })), !result && !error && (_jsx(Text, { type: "secondary", children: "Click a button above to see the response" }))] }));
    return (_jsxs("div", { style: { padding: 24 }, children: [_jsx(Title, { level: 2, children: "HTTP Models Demo" }), _jsx(Text, { type: "secondary", children: "Demonstrating Get and Post HTTP builders with lifecycle callbacks" }), _jsx("div", { style: { marginTop: 24 }, children: infoSection.render() }), _jsxs("div", { style: { display: 'flex', gap: 24, marginTop: 24 }, children: [_jsxs("div", { style: { flex: 1 }, children: [getExamples.render(), _jsx("div", { style: { marginTop: 16 }, children: postExamples.render() })] }), _jsx("div", { style: { flex: 1 }, children: resultsSection.render() })] })] }));
}
export default HttpDemoPage;
