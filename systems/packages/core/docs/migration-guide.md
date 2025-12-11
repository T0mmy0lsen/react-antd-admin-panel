# Migration Guide: v1.x to v2.0

This guide helps you migrate from react-antd-admin-panel v1.x to v2.0.

## Overview of Changes

v2.0 is a complete rewrite with a new builder pattern API. While this means existing v1.x code won't work directly, the new API is more type-safe, flexible, and powerful.

## Requirements

### Peer Dependencies

| Dependency | v1.x | v2.0 |
|------------|------|------|
| React | 16.8+ / 17.x / 18.x | **19.1.0+** |
| Ant Design | 4.x | **6.1.0+** |
| @ant-design/icons | 4.x | **6.0.0+** |
| dayjs | 1.x | 1.11.0+ |

### Node.js
- v1.x: Node 14+
- v2.0: Node 18+ (for ESM support)

## Installation

```bash
# Remove v1
npm uninstall react-antd-admin-panel

# Install v2 with new peer dependencies
npm install react-antd-admin-panel@latest
npm install react@19 react-dom@19 antd@6 @ant-design/icons@6
```

## API Changes

### Tables → List Builder

**v1.x:**
```tsx
import { AdminTable } from 'react-antd-admin-panel';

function Users() {
  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
  ];

  return (
    <AdminTable
      columns={columns}
      dataSource={users}
      loading={loading}
      pagination={{ pageSize: 10 }}
      onEdit={(record) => navigate(`/users/${record.id}`)}
      onDelete={(record) => deleteUser(record.id)}
    />
  );
}
```

**v2.0:**
```tsx
import { List } from 'react-antd-admin-panel';

function Users() {
  const list = new List<User>()
    .column('name', 'Name')
    .column('email', 'Email')
    .action('edit', 'Edit', (record) => navigate(`/users/${record.id}`))
    .action('delete', 'Delete', (record) => deleteUser(record.id), { 
      danger: true, 
      confirm: 'Are you sure?' 
    })
    .dataSource(users)
    .loading(loading)
    .pagination({ pageSize: 10 });

  return list.render();
}
```

### Forms → Form Builders

**v1.x:**
```tsx
import { AdminForm, FormField } from 'react-antd-admin-panel';

function UserForm() {
  return (
    <AdminForm onSubmit={handleSubmit}>
      <FormField name="name" label="Name" required />
      <FormField name="email" label="Email" type="email" />
      <FormField name="role" label="Role" type="select" options={roles} />
    </AdminForm>
  );
}
```

**v2.0:**
```tsx
import { Input, Select } from 'react-antd-admin-panel/form';
import { Form } from 'antd';

function UserForm() {
  const nameField = new Input()
    .label('Name')
    .required()
    .placeholder('Enter name');

  const emailField = new Input()
    .label('Email')
    .email()
    .placeholder('Enter email');

  const roleField = new Select()
    .label('Role')
    .options(roles);

  return (
    <Form onFinish={handleSubmit}>
      {nameField.render()}
      {emailField.render()}
      {roleField.render()}
    </Form>
  );
}
```

### HTTP Requests → Get/Post Builders

**v1.x:**
```tsx
import { useApi } from 'react-antd-admin-panel';

function Users() {
  const { data, loading, error, refetch } = useApi('/api/users');
  // ...
}
```

**v2.0:**
```tsx
import { useGet } from 'react-antd-admin-panel/hooks';

function Users() {
  const { data, loading, error, refetch } = useGet<User[]>('/api/users');
  // ...
}

// Or with builder pattern for more control
import { Get } from 'react-antd-admin-panel/http';

const request = new Get<User[]>()
  .target('/api/users')
  .params({ page: 1 })
  .onThen((data) => setUsers(data));

await request.fetch();
```

### Authentication → MainProvider

**v1.x:**
```tsx
import { AuthProvider } from 'react-antd-admin-panel';

function App() {
  return (
    <AuthProvider 
      user={user}
      onLogout={logout}
    >
      <Dashboard />
    </AuthProvider>
  );
}
```

**v2.0:**
```tsx
import { MainProvider } from 'react-antd-admin-panel/main';

function App() {
  return (
    <MainProvider 
      config={{
        config: {
          pathToApi: '/api',
          boot: async (main) => {
            // Load user on startup
            const user = await fetchCurrentUser();
            main.User().set(user);
          },
        },
        sections: { /* routes */ },
      }}
      navigate={navigate}
    >
      <Dashboard />
    </MainProvider>
  );
}
```

### Access Control

**v1.x:**
```tsx
import { RequireRole } from 'react-antd-admin-panel';

<RequireRole role="admin">
  <AdminPanel />
</RequireRole>
```

**v2.0:**
```tsx
import { AccessGuard } from 'react-antd-admin-panel/access';

<AccessGuard role="admin" fallback={<AccessDenied />}>
  <AdminPanel />
</AccessGuard>

// Or with hook
import { useAccess } from 'react-antd-admin-panel/hooks';

function AdminPanel() {
  const { hasRole, hasPermission } = useAccess();
  
  if (!hasRole('admin')) {
    return <AccessDenied />;
  }
  // ...
}
```

## Import Changes

### Subpath Exports

v2.0 uses subpath exports for tree-shaking:

```tsx
// v1.x - single entry point
import { AdminTable, AdminForm, useApi } from 'react-antd-admin-panel';

// v2.0 - subpath exports
import { List } from 'react-antd-admin-panel/list';
import { Input, Select } from 'react-antd-admin-panel/form';
import { Get, Post } from 'react-antd-admin-panel/http';
import { useGet, usePost } from 'react-antd-admin-panel/hooks';
import { MainProvider } from 'react-antd-admin-panel/main';
import { AccessGuard } from 'react-antd-admin-panel/access';

// Or import everything from main entry (larger bundle)
import { List, Input, Get, MainProvider } from 'react-antd-admin-panel';
```

## Removed Features

These v1.x features have been removed or replaced:

| v1.x Feature | v2.0 Replacement |
|--------------|------------------|
| PropTypes validation | TypeScript generics |
| Class components | Functional components + hooks |
| `AdminTable` | `List` builder |
| `AdminForm` | Form field builders + Ant Design Form |
| `FormField` | Individual field builders (Input, Select, etc.) |
| `useApi` | `useGet` / `usePost` hooks |
| `AuthProvider` | `MainProvider` |
| `RequireRole` | `AccessGuard` |

## TypeScript

v2.0 is TypeScript-first. All builders support generics:

```tsx
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// Full type safety
const list = new List<User>()
  .column('name', 'Name')  // ✅ Autocomplete for 'name'
  .column('foo', 'Foo');   // ❌ TypeScript error: 'foo' not in User
```

## Testing

v2.0 includes testing utilities:

```tsx
import { createMockMain, createMockList, createMockHttp } from 'react-antd-admin-panel/testing';

// Create mock context for testing
const { wrapper, mockNavigate } = createMockMain({
  user: { id: '1', name: 'Test User' },
});

render(<MyComponent />, { wrapper });
```

## Need Help?

- [Full Documentation](../README.md)
- [API Reference](./README.md)
- [Testing Guide](./testing-guide.md)
- [GitHub Issues](https://github.com/user/react-antd-admin-panel/issues)
