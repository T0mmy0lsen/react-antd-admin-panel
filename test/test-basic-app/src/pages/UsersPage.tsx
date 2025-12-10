import { Typography, Table, Button, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useList } from 'react-antd-admin-panel';

const { Title } = Typography;

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function UsersPage() {
  const { data, loading, refresh, pagination, setPagination } = useList<User>({
    get: 'https://jsonplaceholder.typicode.com/users',
    pagination: { pageSize: 5, current: 1 },
    rowKey: 'id',
  });

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Title level={2} style={{ margin: 0 }}>Users</Title>
        <Button icon={<ReloadOutlined />} onClick={refresh}>
          Refresh
        </Button>
      </Space>

      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} users`,
        }}
      />
    </div>
  );
}
