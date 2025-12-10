# react-antd-admin-panel

> TypeScript-first React admin panel builder with Ant Design 6

[![npm version](https://img.shields.io/npm/v/react-antd-admin-panel.svg)](https://www.npmjs.com/package/react-antd-admin-panel)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-6-blue.svg)](https://ant.design/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Build admin panels rapidly using a fluent builder pattern API with full TypeScript support.

## Features

- 🏗️ **Builder Pattern** - Fluent, chainable API for building UI components
- 📘 **TypeScript First** - Full type safety with generics throughout
- ⚛️ **React 19** - Built for the latest React with hooks support
- 🎨 **Ant Design 6** - Beautiful, production-ready components
- 🌳 **Tree-Shakeable** - Import only what you need
- 🪝 **Hooks API** - Modern React hooks alongside builders

## Installation

```bash
npm install react-antd-admin-panel antd @ant-design/icons
```

## Quick Start

### Using the CLI (Recommended)

```bash
npx create-raap-app my-admin-app
cd my-admin-app
npm install
npm run dev
```

### Manual Setup

```tsx
import { MainProvider, List, Get } from 'react-antd-admin-panel';

function App() {
  return (
    <MainProvider config={{ pathToApi: 'https://api.example.com' }}>
      <UserList />
    </MainProvider>
  );
}

function UserList() {
  const list = new List<User>()
    .get(() => new Get<User[]>().target('/users'))
    .column('name', 'Name', { sorter: true })
    .column('email', 'Email')
    .footer(true);

  return list.render();
}
```

## Core Concepts

### HTTP Layer

Type-safe HTTP requests with builder pattern:

```tsx
import { Get, Post } from 'react-antd-admin-panel/http';

// GET request
const users = new Get<User[]>()
  .target('/api/users')
  .params({ page: 1, limit: 10 })
  .onThen((data) => console.log(data))
  .onCatch((error) => console.error(error));

await users.fetch();

// POST request
const createUser = new Post<UserInput, User>()
  .target('/api/users')
  .body({ name: 'John', email: 'john@example.com' })
  .onThen((user) => console.log('Created:', user));

await createUser.execute();
```

### Hooks API

Modern React hooks for common patterns:

```tsx
import { useGet, usePost, useForm, useAccess } from 'react-antd-admin-panel/hooks';

function Users() {
  const { data, loading, error, refetch } = useGet<User[]>('/api/users');
  
  if (loading) return <Spin />;
  if (error) return <Alert type="error" message={error.message} />;
  
  return <UserTable users={data} onRefresh={refetch} />;
}
```

### List Builder

Data tables with sorting, filtering, and pagination:

```tsx
import { List } from 'react-antd-admin-panel/list';
import { Get } from 'react-antd-admin-panel/http';

const userList = new List<User>()
  .get(() => new Get<User[]>().target('/api/users'))
  .column('name', 'Name', { sorter: true })
  .column('email', 'Email', { width: 200 })
  .column('role', 'Role', (value) => <Tag>{value}</Tag>)
  .pagination({ pageSize: 20 })
  .footer(true);
```

### Form Controls

Form inputs with validation:

```tsx
import { Input, Select } from 'react-antd-admin-panel/form';

const nameInput = new Input()
  .key('name')
  .label('Full Name')
  .required(true)
  .placeholder('Enter your name');

const roleSelect = new Select<'admin' | 'user'>()
  .key('role')
  .label('Role')
  .options([
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' }
  ]);
```

### Access Control

Role-based access control:

```tsx
import { AccessGuard } from 'react-antd-admin-panel/access';

<AccessGuard roles={['admin']}>
  <Button danger>Delete User</Button>
</AccessGuard>

<AccessGuard permissions={['users.edit']} fallback={<span>No access</span>}>
  <EditUserForm />
</AccessGuard>
```

### Actions with Confirmation

Buttons with built-in confirmation dialogs:

```tsx
import { ActionButton } from 'react-antd-admin-panel/action';

const deleteButton = new ActionButton()
  .label('Delete')
  .danger(true)
  .confirm({
    title: 'Delete User?',
    content: 'This action cannot be undone.',
    okText: 'Delete',
    cancelText: 'Cancel'
  })
  .onClick(async () => {
    await deleteUser(userId);
  });
```

## Subpath Exports

Import only what you need for optimal bundle size:

```tsx
import { List } from 'react-antd-admin-panel/list';
import { Input, Select } from 'react-antd-admin-panel/form';
import { Get, Post } from 'react-antd-admin-panel/http';
import { useGet, usePost } from 'react-antd-admin-panel/hooks';
import { MainProvider } from 'react-antd-admin-panel/main';
import { Section } from 'react-antd-admin-panel/section';
import { AccessGuard } from 'react-antd-admin-panel/access';
import { Formula } from 'react-antd-admin-panel/formula';
import { ActionButton } from 'react-antd-admin-panel/action';
```

## Peer Dependencies

- React 19.1+
- Ant Design 6.1+
- @ant-design/icons 6+
- dayjs 1.11+

## Documentation

- [Storybook](https://your-storybook-url.com) - Interactive component gallery
- [API Reference](https://your-docs-url.com) - Full API documentation

## License

MIT © react-antd-admin-panel contributors