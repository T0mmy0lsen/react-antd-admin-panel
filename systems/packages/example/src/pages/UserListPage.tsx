import { useState, useEffect, useRef } from 'react';
import { Typography, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Get, Loader, Section, Condition, List, LoaderData } from 'react-antd-admin-panel';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

interface User {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  role?: 'admin' | 'user' | 'guest';
  active?: boolean;
  createdAt: string;
}

const API_URL = 'https://68b566a4e5dc090291aee28b.mockapi.io/api/v1/users';

function UserListPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const hasFetched = useRef(false);

  // Create a reusable Loader instance for data fetching
  const userLoader = new Loader()
    .add('users', new Get<User[]>().target(API_URL), { required: true })
    .onBeforeLoad(() => {
      setLoading(true);
      setError(null);
    })
    .onLoad((data: LoaderData) => {
      setUsers(data.users);
    })
    .onError((err: Error) => {
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
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query)
    );
  });

  // Use the List builder with advanced features
  const userList = new List<User>()
    .rowKey('id')
    .dataSource(filteredUsers)
    .loading(loading)
    // Header controls: search, create, refresh
    .header({
      title: 'Users',
      showSearch: true,
      searchPlaceholder: 'Search by name, email, or role...',
      onSearch: (query: string) => setSearchQuery(query),
      showCreate: true,
      createLabel: 'Add User',
      onCreate: () => navigate('/users/add'),
      showRefresh: true,
      onRefresh: () => fetchUsers(true),
    })
    // Enable row selection with bulk actions
    .selectable('checkbox')
    .bulkAction('delete', 'Delete Selected', (rows: User[]) => {
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
    .action('edit', 'Edit', (record: User) => {
      message.info(`Edit user: ${record.name}`);
    }, { icon: <EditOutlined /> })
    .action('delete', 'Delete', (record: User) => {
      message.warning(`Deleted user: ${record.name}`);
    }, { icon: <DeleteOutlined />, danger: true, confirm: 'Delete this user?' })
    // Expandable rows to show user details
    .expandableRow(
      (record: User) => (
        <div style={{ padding: '8px 16px' }}>
          <p><strong>Email:</strong> {record.email || 'N/A'}</p>
          <p><strong>Bio:</strong> This is a sample bio for {record.name}.</p>
          <p><strong>Created:</strong> {new Date(record.createdAt).toLocaleString()}</p>
        </div>
      ),
      () => true // All rows are expandable
    )
    .pagination({ 
      pageSize: 10, 
      showSizeChanger: true,
      showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} of ${total} users`,
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
    .when(
      (d: { error: string | null; users: User[] }) => d.error !== null,
      new Section()
        .card({ title: 'Error' })
        .add(<Text type="danger">{error}</Text>)
        .render()
    )
    .otherwise(tableSection.render());

  return (
    <div>
      {contentSection.render()}
    </div>
  );
}

export default UserListPage;
