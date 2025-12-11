# Testing Guide

This guide covers how to test applications built with `react-antd-admin-panel`. The library provides testing utilities that make it easy to write unit and integration tests.

## Installation

The testing utilities are included in the main package and exported from a separate subpath:

```typescript
import { createMockMain, createMockList, createMockHttp } from 'react-antd-admin-panel/testing';
```

## Testing Utilities

### `createMockMain`

Creates a mock `MainProvider` context wrapper for testing components that use `useMain`, `useUser`, or `useStore` hooks.

```typescript
import { createMockMain } from 'react-antd-admin-panel/testing';
import { render, screen } from '@testing-library/react';

const { wrapper, mockNavigate, mockHttp, userState, store } = createMockMain({
  user: { id: '1', name: 'Test User', role: 'admin' },
  store: { theme: 'dark' },
  config: { pathToApi: '/api' },
});

// Use with @testing-library/react
render(<MyComponent />, { wrapper });
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `user` | `User` | Initial user data for authentication |
| `store` | `Record<string, any>` | Initial global store values |
| `config` | `Partial<MainConfig['config']>` | Configuration overrides |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `wrapper` | `React.FC` | Wrapper component for testing-library |
| `mockNavigate` | `MockFunction` | Tracks navigation calls |
| `mockHttp` | `MockHttp` | HTTP mock instance |
| `mainInstance` | `MainInstance` | Direct access to Main context |
| `userState` | `UserState` | Direct access to user state |
| `store` | `GlobalStore` | Direct access to global store |

### `createMockList`

Creates a pre-configured `List` instance with test data.

```typescript
import { createMockList } from 'react-antd-admin-panel/testing';

interface User {
  id: string;
  name: string;
  email: string;
}

const mockList = createMockList<User>({
  data: [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
  ],
  loading: false,
  pagination: { pageSize: 10, current: 1, total: 2 },
});

// Continue building the list
mockList.column('name', 'Name').column('email', 'Email');
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `data` | `T[]` | Test data array |
| `rowKey` | `string \| ((record: T) => string)` | Row key (default: 'id') |
| `loading` | `boolean` | Loading state |
| `pagination` | `false \| PaginationConfig` | Pagination settings |
| `empty` | `boolean` | Set to true for empty state |
| `emptyText` | `string` | Custom empty state message |

### `createMockHttp`

Creates a mock HTTP handler for testing API interactions.

```typescript
import { createMockHttp } from 'react-antd-admin-panel/testing';

const mockHttp = createMockHttp()
  .onGet('/api/users', { data: [{ id: 1, name: 'John' }] })
  .onPost('/api/users', { data: { id: 2, name: 'Jane' }, status: 201 })
  .onGet('/api/error', { error: new Error('Server error') });

// Use in tests
const response = await mockHttp.get('/api/users');
expect(response.data).toEqual([{ id: 1, name: 'John' }]);
```

**Mock Response Options:**

| Option | Type | Description |
|--------|------|-------------|
| `data` | `any` | Response data |
| `error` | `Error` | Error to throw |
| `delay` | `number` | Delay in milliseconds |
| `status` | `number` | HTTP status code (default: 200) |

## Example Test Patterns

### Pattern 1: Testing a Component with useMain

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMockMain } from 'react-antd-admin-panel/testing';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  it('displays user name', () => {
    const { wrapper } = createMockMain({
      user: { id: '1', name: 'John Doe', email: 'john@example.com' },
    });

    render(<UserProfile />, { wrapper });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('shows login prompt when not authenticated', () => {
    const { wrapper } = createMockMain(); // No user

    render(<UserProfile />, { wrapper });

    expect(screen.getByText('Please log in')).toBeInTheDocument();
  });
});
```

### Pattern 2: Testing Navigation

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMockMain } from 'react-antd-admin-panel/testing';
import { NavigationButton } from './NavigationButton';

describe('NavigationButton', () => {
  it('navigates to the correct path when clicked', () => {
    const { wrapper, mockNavigate } = createMockMain();

    render(<NavigationButton to="/settings" />, { wrapper });
    
    fireEvent.click(screen.getByRole('button'));

    expect(mockNavigate.mock.calls).toHaveLength(1);
    expect(mockNavigate.mock.calls[0][0]).toBe('/settings');
  });
});
```

### Pattern 3: Testing Role-Based Access

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMockMain } from 'react-antd-admin-panel/testing';
import { AdminPanel } from './AdminPanel';

describe('AdminPanel', () => {
  it('shows admin content for admin users', () => {
    const { wrapper } = createMockMain({
      user: { id: '1', role: 'admin' },
    });

    render(<AdminPanel />, { wrapper });

    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('shows access denied for non-admin users', () => {
    const { wrapper } = createMockMain({
      user: { id: '1', role: 'user' },
    });

    render(<AdminPanel />, { wrapper });

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });
});
```

### Pattern 4: Testing with Store Values

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMockMain } from 'react-antd-admin-panel/testing';
import { ThemeDisplay } from './ThemeDisplay';

describe('ThemeDisplay', () => {
  it('displays current theme from store', () => {
    const { wrapper } = createMockMain({
      store: { theme: 'dark' },
    });

    render(<ThemeDisplay />, { wrapper });

    expect(screen.getByText('Current theme: dark')).toBeInTheDocument();
  });

  it('can update store during test', () => {
    const { wrapper, store } = createMockMain({
      store: { theme: 'light' },
    });

    render(<ThemeDisplay />, { wrapper });
    
    // Update store programmatically
    store.set('theme', 'dark');
    
    // Component should react to change
    expect(screen.getByText('Current theme: dark')).toBeInTheDocument();
  });
});
```

### Pattern 5: Testing List Components

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMockMain, createMockList } from 'react-antd-admin-panel/testing';

interface User {
  id: string;
  name: string;
}

describe('UserList', () => {
  it('renders list with mock data', () => {
    const { wrapper } = createMockMain();
    
    const list = createMockList<User>({
      data: [
        { id: '1', name: 'John' },
        { id: '2', name: 'Jane' },
      ],
    })
      .column('name', 'Name');

    render(list.render() as React.ReactElement, { wrapper });

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    const { wrapper } = createMockMain();
    
    const list = createMockList<User>({ loading: true })
      .column('name', 'Name');

    render(list.render() as React.ReactElement, { wrapper });

    // Ant Design shows a loading spinner
    expect(document.querySelector('.ant-spin')).toBeInTheDocument();
  });

  it('shows empty state', () => {
    const { wrapper } = createMockMain();
    
    const list = createMockList<User>({
      empty: true,
      emptyText: 'No users found',
    })
      .column('name', 'Name');

    render(list.render() as React.ReactElement, { wrapper });

    expect(screen.getByText('No users found')).toBeInTheDocument();
  });
});
```

### Pattern 6: Testing HTTP Interactions

```typescript
import { describe, it, expect } from 'vitest';
import { createMockHttp } from 'react-antd-admin-panel/testing';

describe('API Service', () => {
  it('fetches users successfully', async () => {
    const mockHttp = createMockHttp()
      .onGet('/api/users', { 
        data: [{ id: 1, name: 'John' }],
        status: 200,
      });

    const response = await mockHttp.get('/api/users');

    expect(response.status).toBe(200);
    expect(response.data).toHaveLength(1);
  });

  it('handles errors correctly', async () => {
    const mockHttp = createMockHttp()
      .onGet('/api/users', { 
        error: new Error('Network error'),
      });

    await expect(mockHttp.get('/api/users')).rejects.toThrow('Network error');
  });

  it('simulates slow responses', async () => {
    const mockHttp = createMockHttp()
      .onGet('/api/slow', { 
        data: 'done',
        delay: 100,
      });

    const start = Date.now();
    await mockHttp.get('/api/slow');
    const elapsed = Date.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(100);
  });
});
```

## Best Practices

1. **Use TypeScript generics** - Always type your mock data for better IDE support:
   ```typescript
   createMockList<User>({ data: users })
   ```

2. **Reset mocks between tests** - Clear navigation calls and HTTP handlers:
   ```typescript
   beforeEach(() => {
     mockNavigate.mockClear();
     mockHttp.clear();
   });
   ```

3. **Test edge cases** - Test empty states, loading states, and error states:
   ```typescript
   createMockList({ empty: true, emptyText: 'No data' })
   ```

4. **Use meaningful test data** - Create realistic test fixtures:
   ```typescript
   const testUsers = [
     { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
     { id: '2', name: 'Jane Doe', email: 'jane@example.com', role: 'user' },
   ];
   ```

5. **Test accessibility** - Verify ARIA attributes are present:
   ```typescript
   expect(screen.getByRole('button', { name: 'Create new item' })).toBeInTheDocument();
   ```

## Troubleshooting

### "useMain must be used within a MainProvider"

Make sure to wrap your component with the `wrapper` from `createMockMain`:

```typescript
const { wrapper } = createMockMain();
render(<MyComponent />, { wrapper }); // ✅ Correct

render(<MyComponent />); // ❌ Missing wrapper
```

### Mock navigation not tracking calls

Ensure you're using the `mockNavigate` from the result, not a different function:

```typescript
const { mockNavigate } = createMockMain();
// The component should use useMain().navigate internally
```

### HTTP mock not matching

Make sure the URL exactly matches what your code is calling:

```typescript
mockHttp.onGet('/api/users', { data: [] }); // Matches /api/users
mockHttp.onGet('/users', { data: [] });     // Does NOT match /api/users
```
