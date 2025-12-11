# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2025-12-11

### Added
- **Testing Utilities**: New `/testing` subpath with `createMockMain`, `createMockList`, `createMockHttp`
- **Accessibility**: WCAG 2.1 AA compliance improvements
  - Proper label-input association with `htmlFor`/`id`
  - ARIA attributes (`aria-label`, `aria-describedby`, `aria-required`)
  - Screen reader support for required fields
  - Accessible icon-only buttons with tooltips
- **Performance**: React.memo, useMemo, useCallback optimizations
- **Bundle Analysis**: Added `build:analyze` script with rollup-plugin-visualizer
- **Documentation**: Migration guide, testing guide, comprehensive CHANGELOG

### Changed
- FormFieldBuilder now generates unique field IDs for accessibility
- Action class supports `tooltip()` method for accessibility labels
- List component header buttons have proper ARIA labels
- All packages synchronized to v2.1.0

## [2.0.0] - 2025-12-10

### Added

#### Core Package (`react-antd-admin-panel`)
- **TypeScript-first Builder Pattern API**: Fluent, chainable API for building UI components
- **React 19 Support**: Built for React 19.1+ with modern hooks
- **Ant Design 6 Integration**: Beautiful, production-ready components

#### Builders
- **List Builder**: Table/list component with columns, actions, pagination, virtual scrolling
- **Form Builders**: Input, Select, Checkbox, Radio, Switch, DatePicker, TextArea, Number, Password
- **Section Builder**: Layout sections with title, description, collapsible support
- **Action Builder**: Buttons with confirmation dialogs, icons, loading states
- **Formula Builder**: Conditional rendering based on form state

#### HTTP Layer
- **Get**: Type-safe HTTP GET requests with builder pattern
- **Post**: Type-safe HTTP POST/PUT/DELETE requests
- **Hooks**: `useGet`, `usePost` for React integration

#### Main Orchestrator
- **MainProvider**: Central app context with user state and global store
- **AppLayout**: Sidebar navigation with responsive design
- **ProfileMenu**: User dropdown with avatar and logout
- **ProtectedRoute**: Role and permission-based access control

#### Hooks API
- `useGet<T>` - Fetch data with loading/error states
- `usePost<T>` - Submit data with optimistic updates
- `useMain` - Access Main context
- `useUser` - Access authenticated user
- `useStore` / `useStoreActions` - Global state management
- `useAccess` - Role/permission checking

#### Access Control
- **AccessGuard**: Component-level access control
- **Role-based**: Single role requirement
- **Permission-based**: Multiple permission checking
- **Feature flags**: Numeric access levels

#### CLI Tool (`create-raap-app`)
- Scaffolds new admin panel projects
- TypeScript + Vite + React Router setup
- Example pages demonstrating all features

### Changed
- Complete architectural rewrite from v1
- Modern ESM-first package structure
- Tree-shakeable subpath exports

### Breaking Changes
- **Requires React 19.1.0+** (was React 16/17/18)
- **Requires Ant Design 6.1.0+** (was Ant Design 4)
- **New API**: Not backwards compatible with v1.x
- All components use builder pattern instead of JSX props
- HTTP layer uses builder pattern instead of hooks-only

### Removed
- Legacy class components
- PropTypes (TypeScript-only now)
- Ant Design 4 compatibility

## [1.x] - Legacy

See legacy documentation for v1.x releases. v1.x is no longer maintained.

---

## Migration from v1.x to v2.0

See [Migration Guide](./packages/core/docs/migration-guide.md) for detailed upgrade instructions.

### Quick Migration

**Before (v1.x):**
```tsx
import { AdminTable } from 'react-antd-admin-panel';

<AdminTable
  columns={columns}
  dataSource={data}
  onEdit={(record) => handleEdit(record)}
/>
```

**After (v2.0):**
```tsx
import { List } from 'react-antd-admin-panel';

new List<User>()
  .column('name', 'Name')
  .column('email', 'Email')
  .action('edit', 'Edit', (record) => handleEdit(record))
  .dataSource(data)
  .render();
```
