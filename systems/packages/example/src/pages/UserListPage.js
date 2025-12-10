import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Typography, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Get, Loader, Section, Condition, List } from 'react-antd-admin-panel';
import { useNavigate } from 'react-router-dom';
const { Text } = Typography;
const API_URL = 'https://68b566a4e5dc090291aee28b.mockapi.io/api/v1/users';
function UserListPage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const hasFetched = useRef(false);
    // Create a reusable Loader instance for data fetching
    const userLoader = new Loader()
        .add('users', new Get().target(API_URL), { required: true })
        .onBeforeLoad(() => {
        setLoading(true);
        setError(null);
    })
        .onLoad((data) => {
        setUsers(data.users);
    })
        .onError((err) => {
        setError(err.message);
        message.error('Failed to load users');
    })
        .onAfterLoad(() => {
        setLoading(false);
    });
    const fetchUsers = async (showToast = false) => {
        await userLoader.execute();
        if (showToast && !error) {
            message.success('Users loaded successfully');
        }
    };
    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchUsers(false);
        }
    }, []);
    // Filter users based on search query
    const filteredUsers = users.filter(user => {
        if (!searchQuery)
            return true;
        const query = searchQuery.toLowerCase();
        return (user.name.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.role?.toLowerCase().includes(query));
    });
    // Use the List builder with advanced features
    const userList = new List()
        .rowKey('id')
        .dataSource(filteredUsers)
        .loading(loading)
        // Header controls: search, create, refresh
        .header({
        title: 'Users',
        showSearch: true,
        searchPlaceholder: 'Search by name, email, or role...',
        onSearch: (query) => setSearchQuery(query),
        showCreate: true,
        createLabel: 'Add User',
        onCreate: () => navigate('/users/add'),
        showRefresh: true,
        onRefresh: () => fetchUsers(true),
    })
        // Enable row selection with bulk actions
        .selectable('checkbox')
        .bulkAction('delete', 'Delete Selected', (rows) => {
        message.warning(`Would delete ${rows.length} users: ${rows.map(r => r.name).join(', ')}`);
    }, { danger: true, confirm: 'Are you sure you want to delete the selected users?' })
        // Columns
        .avatarColumn('avatar', 'Avatar', 48)
        .column('id', 'ID', { width: 80 })
        .column('name', 'Name')
        .column('email', 'Email', { ellipsis: true })
        .tagColumn('role', 'Role', {
        admin: 'red',
        user: 'blue',
        guest: 'default',
    })
        .booleanColumn('active', 'Status', {
        trueLabel: 'Active',
        falseLabel: 'Inactive',
        trueColor: 'green',
        falseColor: 'default',
    })
        .dateColumn('createdAt', 'Created', 'date')
        // Row actions with confirm dialog
        .action('edit', 'Edit', (record) => {
        message.info(`Edit user: ${record.name}`);
    }, { icon: _jsx(EditOutlined, {}) })
        .action('delete', 'Delete', (record) => {
        message.warning(`Deleted user: ${record.name}`);
    }, { icon: _jsx(DeleteOutlined, {}), danger: true, confirm: 'Delete this user?' })
        // Expandable rows to show user details
        .expandableRow((record) => (_jsxs("div", { style: { padding: '8px 16px' }, children: [_jsxs("p", { children: [_jsx("strong", { children: "Email:" }), " ", record.email || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Bio:" }), " This is a sample bio for ", record.name, "."] }), _jsxs("p", { children: [_jsx("strong", { children: "Created:" }), " ", new Date(record.createdAt).toLocaleString()] })] })), () => true // All rows are expandable
    )
        .pagination({
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
    })
        .size('middle')
        .emptyText('No users found');
    // Use Section with card wrapper for the List
    const tableSection = new Section()
        .card({ title: `Users (${filteredUsers.length})` })
        .add(userList.render());
    // Conditional content based on error state
    const contentSection = new Condition()
        .data({ error, users: filteredUsers })
        .when((d) => d.error !== null, new Section()
        .card({ title: 'Error' })
        .add(_jsx(Text, { type: "danger", children: error }))
        .render())
        .otherwise(tableSection.render());
    return (_jsx("div", { children: contentSection.render() }));
}
export default UserListPage;
