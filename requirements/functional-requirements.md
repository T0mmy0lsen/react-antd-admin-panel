# Functional Requirements - react-antd-admin-panel v2

**Version:** 2.0.0  
**Target Stack:** React 19.1.0, TypeScript 5.9.2, Ant Design 6.1.0  
**Status:**  IN PROGRESS  
**Created:** December 9, 2025

---

## Overview

This document defines the functional requirements for react-antd-admin-panel v2, a TypeScript-first admin panel builder combining declarative builders with modern React patterns.

**Core Value Proposition:**  
"A TypeScript-first admin panel builder that combines the power of declarative builders with modern React patterns, offering excellent DX while maintaining the flexibility to customize anything."

---

## Feature Prioritization

Based on discovery analysis, features are organized into 4 tiers:

### Tier 1: Must Have (MVP)
Core features required for v2 launch. Without these, v2 cannot replace v1.

-  **List Component** - Primary CRUD interface
-  **Section Component** - Layout and composition
-  **Form Controls** - Input, Select, Checkbox, DatePicker, TextArea, Radio, Switch
-  **Get/Post Models** - HTTP abstraction
-  **Main Orchestrator** - Central control and lifecycle
-  **TypeScript Generics** - Type-safe throughout
-  **Core Documentation** - Getting started, API reference, examples

### Tier 2: High Priority
Features that significantly improve DX and are commonly used.

-  **Hooks API** - Alongside builder pattern
-  **Access Control** - Improved ergonomics
-  **Formula/Action System** - Form handling and mutations
-  **Tree-shaking Support** - Modular exports
-  **List Extensions** - ListHeader, ListActions, ListSearch, ListEdit
-  **Theme System** - Ant Design 6 theming integration

### Tier 3: Nice to Have
Enhances productivity but not critical for launch.

-  **Dev Tools** - Debug panel, state inspection
-  **Testing Utilities** - Mock builders, test helpers
-  **Advanced Components** - Tree, Steps, Tabs, Collapse
-  **Plugin System** - Custom component registration

### Tier 4: Consider/Research
Features requiring more research or lower priority.

- 🟣 **React 19 Server Actions** - Server-side mutations
- 🟣 **Graph/Chart** - Data visualization (research demand)
- 🟣 **Advanced Tree-shaking** - Dynamic imports
- 🟣 **AI-Assisted Forms** - Smart validation, auto-complete

---

## FR-01: List Component

**Priority:** Tier 1 (Must Have)  
**Complexity:** High  
**Usage:**  (Most used component across all projects)

### Description
CRUD list interface with data fetching, rendering, actions, and expandable details.

### Functional Requirements

#### FR-01.1: Data Loading
- **FR-01.1.1:** Support \get()\ method accepting data source function
- **FR-01.1.2:** Accept \Get\ model instance for API calls
- **FR-01.1.3:** Accept static data array
- **FR-01.1.4:** Support async data loading with loading state
- **FR-01.1.5:** Support data refresh via \refresh()\ method
- **FR-01.1.6:** Expose loading state to parent components

#### FR-01.2: Column Configuration
- **FR-01.2.1:** Support \headerPrepend()\ for adding columns
- **FR-01.2.2:** Support \headerAppend()\ for adding columns
- **FR-01.2.3:** Accept \ListHeader\ model with:
  - \key\ - Data property name
  - \title\ - Column header text
  - \render\ - Custom render function
  - \sorter\ - Sorting configuration
  - \filter\ - Filter configuration
  - \width\ - Column width
  - \fixed\ - Fixed column position
- **FR-01.2.4:** Support responsive column hiding

#### FR-01.3: Row Actions
- **FR-01.3.1:** Support \actions()\ method accepting \Action\ model
- **FR-01.3.2:** Render actions as dropdown menu (default) or inline buttons
- **FR-01.3.3:** Support conditional action visibility based on row data
- **FR-01.3.4:** Support action access control integration
- **FR-01.3.5:** Support confirmation dialogs for destructive actions
- **FR-01.3.6:** Support custom action icons and labels

#### FR-01.4: Expandable Rows
- **FR-01.4.1:** Support \expandable()\ method for row expansion toggle
- **FR-01.4.2:** Support \expandableSection()\ accepting function returning content
- **FR-01.4.3:** Support nested lists in expanded content
- **FR-01.4.4:** Support custom expand icon
- **FR-01.4.5:** Control expanded rows programmatically

#### FR-01.5: Header Controls
- **FR-01.5.1:** Support \headerCreate()\ boolean for create button
- **FR-01.5.2:** Support \headerSearch()\ for search functionality
- **FR-01.5.3:** Support \headerFilter()\ for filter controls
- **FR-01.5.4:** Support \headerExport()\ for data export
- **FR-01.5.5:** Support custom header actions

#### FR-01.6: Empty State
- **FR-01.6.1:** Support \emptyText()\ for custom message
- **FR-01.6.2:** Support \emptyIcon()\ for custom icon
- **FR-01.6.3:** Support \emptyColumn()\ boolean for empty state styling
- **FR-01.6.4:** Support \emptyAction()\ for call-to-action button

#### FR-01.7: Footer Configuration
- **FR-01.7.1:** Support \footer()\ boolean to show/hide
- **FR-01.7.2:** Support custom footer content
- **FR-01.7.3:** Support pagination configuration (pageSize, current)
- **FR-01.7.4:** Support total count display

#### FR-01.8: List Extensions (Tier 2)
- **FR-01.8.1:** \ListSearch\ - Inline search with debounce
- **FR-01.8.2:** \ListActions\ - Bulk actions on selected rows
- **FR-01.8.3:** \ListEdit\ - Inline editing mode
- **FR-01.8.4:** \ListMenu\ - Filter/sort menu overlay

### API Examples

#### Builder Pattern
\\\typescript
const list = new List<User>()
    .get(() => new Get<User[]>().target('/api/users'))
    .headerPrepend(new ListHeader<User>()
        .key('name')
        .title('Name')
        .sorter(true)
        .render((value, record) => <strong>{value}</strong>))
    .headerPrepend(new ListHeader<User>()
        .key('email')
        .title('Email')
        .width(200))
    .expandable(() => true)
    .expandableSection((user) => userDetailSection(user))
    .actions(new Action()
        .key('delete')
        .label('Delete')
        .confirm('Are you sure?')
        .formula(new Formula(new Post()
            .target(\/api/users/\\)
            .method('DELETE')
            .onThen(() => list.refresh()))))
    .footer(true)
    .emptyText('No users found');
\\\

#### Hooks API (Tier 2)
\\\typescript
const { data, loading, refresh } = useList<User>({
    get: () => new Get<User[]>().target('/api/users'),
    columns: [
        { key: 'name', title: 'Name', sorter: true },
        { key: 'email', title: 'Email', width: 200 }
    ],
    expandable: {
        render: (user) => <UserDetail user={user} />
    },
    actions: [
        {
            key: 'delete',
            label: 'Delete',
            confirm: true,
            onAction: async (user) => {
                await deleteUser(user.id);
                refresh();
            }
        }
    ]
});

return <List {...list.props()} />;
\\\

### Acceptance Criteria
- [ ] Renders data from API, static array, or async function
- [ ] Supports at least 1000 items with <100ms render time (virtual scrolling)
- [ ] Column configuration supports all Ant Design Table features
- [ ] Actions render correctly with access control
- [ ] Expandable rows work with nested content
- [ ] Empty state displays appropriately
- [ ] Pagination works with server-side and client-side modes
- [ ] Fully type-safe with TypeScript 5.9.2 generics

---

## FR-02: Section Component

**Priority:** Tier 1 (Must Have)  
**Complexity:** Medium  
**Usage:**  (Core layout component)

### Description
Layout and composition component for organizing form fields, content blocks, and nested sections.

### Functional Requirements

#### FR-02.1: Layout Configuration
- **FR-02.1.1:** Support \col()\ for column span (24-grid system)
- **FR-02.1.2:** Support \row()\ for row grouping
- **FR-02.1.3:** Support \card()\ boolean for Card wrapper
- **FR-02.1.4:** Support \overlay()\ for modal/drawer rendering
- **FR-02.1.5:** Support responsive breakpoints (xs, sm, md, lg, xl)

#### FR-02.2: Content Management
- **FR-02.2.1:** Support \add()\ method for adding child components
- **FR-02.2.2:** Support \addMore()\ for array of components
- **FR-02.2.3:** Support \addRowStart()\ / \addRowEnd()\ for row positioning
- **FR-02.2.4:** Support nested sections
- **FR-02.2.5:** Support conditional rendering via \conditions()\

#### FR-02.3: Form Integration
- **FR-02.3.1:** Support \formula()\ for form submission
- **FR-02.3.2:** Support \action()\ for button actions
- **FR-02.3.3:** Collect values from child form controls
- **FR-02.3.4:** Support form validation
- **FR-02.3.5:** Support initial values via \get()\

#### FR-02.4: Lifecycle
- **FR-02.4.1:** Support \immediate()\ for instant rendering
- **FR-02.4.2:** Support \async()\ for deferred rendering
- **FR-02.4.3:** Support \refresh()\ for re-rendering
- **FR-02.4.4:** Expose loading state

### API Examples

\\\typescript
const section = new Section()
    .card(true)
    .col(12)
    .formula(new Formula(new Post()
        .target('/api/users')
        .onThen(() => message.success('Saved'))))
    .add(new Input().key('name').label('Name').required(true))
    .add(new Input().key('email').label('Email').required(true))
    .add(new Select<string>()
        .key('role')
        .label('Role')
        .options([
            { label: 'Admin', value: 'admin' },
            { label: 'User', value: 'user' }
        ]))
    .addRowEnd(new Button().label('Save').type('primary'));
\\\

### Acceptance Criteria
- [ ] Supports 24-column grid layout
- [ ] Renders as Card, Modal, Drawer, or inline
- [ ] Collects form values from children
- [ ] Submits via Formula/Post integration
- [ ] Supports nested sections
- [ ] Responsive layout on mobile devices

---

## FR-03: Form Controls

**Priority:** Tier 1 (Must Have)  
**Complexity:** Medium-High  
**Usage:**  (Essential for forms)

### Description
Form input components with validation, conditional logic, and Ant Design 6 integration.

### Core Form Controls (Tier 1)

#### FR-03.1: Input
- Text input with label, placeholder, validation
- Support \type\ (text, password, number, email, url, tel)
- Support \maxLength\, \minLength\
- Support prefix/suffix icons
- Support \disabled\, \required\, \readonly\

#### FR-03.2: Select
- Dropdown selection with options
- Support static options array
- Support async options loading
- Support \mode\ (single, multiple, tags)
- Support search/filter
- Support \showSearch\, \allowClear\

#### FR-03.3: Checkbox
- Boolean checkbox with label
- Support checkbox group (multiple options)
- Support \indeterminate\ state

#### FR-03.4: DatePicker
- Date selection with Ant Design 6 DatePicker
- Support \format\, \showTime\
- Support range selection (DateRangePicker)
- Support \disabledDate\ function

#### FR-03.5: TextArea
- Multi-line text input
- Support \rows\, \maxLength\
- Support \autoSize\

#### FR-03.6: Radio
- Radio button group
- Support horizontal/vertical layout
- Support button style

#### FR-03.7: Switch
- Boolean toggle switch
- Support \checkedChildren\ / \unCheckedChildren\

### Advanced Form Controls (Tier 2)

#### FR-03.8: Upload
- File upload with preview
- Support \multiple\, \maxCount\
- Support drag-and-drop
- Support image preview

#### FR-03.9: Slider
- Numeric range slider
- Support \min\, \max\, \step\
- Support range mode

#### FR-03.10: Rate
- Star rating component
- Support half-stars

### Common Features (All Controls)

- **FR-03.11:** Support \key()\ for form field name
- **FR-03.12:** Support \label()\ for field label
- **FR-03.13:** Support \required()\ for validation
- **FR-03.14:** Support \disabled()\ for read-only state
- **FR-03.15:** Support \hidden()\ for conditional visibility
- **FR-03.16:** Support \onChange()\ callback
- **FR-03.17:** Support \formula()\ / \action()\ for dynamic behavior
- **FR-03.18:** Support \access()\ for permission-based visibility
- **FR-03.19:** Support \tooltip()\ for help text
- **FR-03.20:** Support \placeholder()\

### API Examples

\\\typescript
// Input with validation
new Input()
    .key('email')
    .label('Email Address')
    .required(true)
    .type('email')
    .placeholder('user@example.com')
    .tooltip('Your work email address');

// Select with async options
new Select<string>()
    .key('department')
    .label('Department')
    .get(() => new Get<Option[]>().target('/api/departments'))
    .showSearch(true)
    .allowClear(true);

// DatePicker with range
new DatePicker()
    .key('startDate')
    .label('Start Date')
    .format('YYYY-MM-DD')
    .disabledDate((date) => date.isBefore(moment()));

// Conditional checkbox
new Checkbox()
    .key('agreeToTerms')
    .label('I agree to the terms and conditions')
    .required(true)
    .onChange((checked) => {
        if (checked) {
            // Enable submit button
        }
    });
\\\

### Acceptance Criteria
- [ ] All Tier 1 controls implemented with Ant Design 6
- [ ] Full TypeScript type safety
- [ ] Validation works with Formula submission
- [ ] Conditional rendering via \hidden()\ / \disabled()\
- [ ] Access control integration
- [ ] Consistent API across all controls

---

## FR-04: Get/Post Models

**Priority:** Tier 1 (Must Have)  
**Complexity:** Medium  
**Usage:**  (HTTP abstraction)

### Description
HTTP request abstraction with type safety, lifecycle hooks, and error handling.

### Functional Requirements

#### FR-04.1: Get Model
- **FR-04.1.1:** Support \target()\ for URL configuration
- **FR-04.1.2:** Support query parameters via \params()\
- **FR-04.1.3:** Support headers via \headers()\
- **FR-04.1.4:** Support \onThen()\ success callback
- **FR-04.1.5:** Support \onCatch()\ error callback
- **FR-04.1.6:** Support \onFinally()\ cleanup callback
- **FR-04.1.7:** Support abort signal for cancellation
- **FR-04.1.8:** Return typed response \<T>\

#### FR-04.2: Post Model
- **FR-04.2.1:** Support \target()\ for URL configuration
- **FR-04.2.2:** Support \method()\ (POST, PUT, PATCH, DELETE)
- **FR-04.2.3:** Support \body()\ for request payload
- **FR-04.2.4:** Support \headers()\ for custom headers
- **FR-04.2.5:** Support \onThen()\ success callback
- **FR-04.2.6:** Support \onCatch()\ error callback
- **FR-04.2.7:** Support \onFinally()\ cleanup callback
- **FR-04.2.8:** Support FormData for file uploads
- **FR-04.2.9:** Return typed response \<T>\

#### FR-04.3: HTTP Client Configuration
- **FR-04.3.1:** Support global base URL configuration
- **FR-04.3.2:** Support global headers (authorization tokens)
- **FR-04.3.3:** Support request interceptors
- **FR-04.3.4:** Support response interceptors
- **FR-04.3.5:** Support timeout configuration
- **FR-04.3.6:** Support retry logic

### API Examples

\\\typescript
// GET request with typed response
const getUsers = new Get<User[]>()
    .target('/api/users')
    .params({ page: 1, limit: 10 })
    .headers({ 'X-Custom': 'value' })
    .onThen((users) => {
        console.log('Loaded', users.length, 'users');
    })
    .onCatch((error) => {
        message.error('Failed to load users');
    });

// POST request with body
const saveUser = new Post<User>()
    .target('/api/users')
    .method('POST')
    .body({ name: 'John', email: 'john@example.com' })
    .onThen((user) => {
        message.success(\User \ created\);
        list.refresh();
    })
    .onCatch((error) => {
        message.error(error.message);
    });

// DELETE with confirmation
new Post<void>()
    .target(\/api/users/\\)
    .method('DELETE')
    .onThen(() => {
        message.success('User deleted');
        navigate('/users');
    });

// Dynamic target from form values
new Post<Order>()
    .target((formValues) => \/api/orders/\\)
    .method('PATCH')
    .body((formValues) => ({ status: formValues.status }));
\\\

### Acceptance Criteria
- [ ] Supports GET, POST, PUT, PATCH, DELETE
- [ ] Full TypeScript generics for request/response types
- [ ] Lifecycle hooks (onThen, onCatch, onFinally) work correctly
- [ ] Global configuration via Main orchestrator
- [ ] Request cancellation works
- [ ] Error handling with user feedback

---

## FR-05: Main Orchestrator

**Priority:** Tier 1 (Must Have)  
**Complexity:** High  
**Usage:**  (Central control)

### Description
Central orchestrator managing application state, routing, authentication, and global configuration.

### Functional Requirements

#### FR-05.1: Application Lifecycle
- **FR-05.1.1:** Support \boot()\ callback for initialization
- **FR-05.1.2:** Support async data loading before render
- **FR-05.1.3:** Support \config\ object for global settings
- **FR-05.1.4:** Support hot module replacement (HMR) in dev mode

#### FR-05.2: Routing
- **FR-05.2.1:** Support \sections\ object for route definitions
- **FR-05.2.2:** Support nested routes
- **FR-05.2.3:** Support route parameters
- **FR-05.2.4:** Support \defaultRoute\ configuration
- **FR-05.2.5:** Support programmatic navigation via \navigate()\
- **FR-05.2.6:** Integration with React Router 7

#### FR-05.3: Authentication & User
- **FR-05.3.1:** Support \User\ model for current user
- **FR-05.3.2:** Support authentication state management
- **FR-05.3.3:** Support role-based access control
- **FR-05.3.4:** Support \profile\ configuration for user menu
- **FR-05.3.5:** Support logout callback

#### FR-05.4: State Management
- **FR-05.4.1:** Support \Store\ model for global state
- **FR-05.4.2:** Support reactive state updates
- **FR-05.4.3:** Support persistence (localStorage/sessionStorage)
- **FR-05.4.4:** Support state reset

#### FR-05.5: HTTP Configuration
- **FR-05.5.1:** Support \pathToApi\ for base URL
- **FR-05.5.2:** Support global headers
- **FR-05.5.3:** Support request/response interceptors
- **FR-05.5.4:** Support error handling middleware

#### FR-05.6: Access Control (Tier 2)
- **FR-05.6.1:** Support \access()\ function for permission checks
- **FR-05.6.2:** Support \accessViolationRoute()\ for redirects
- **FR-05.6.3:** Support \accessViolationApi()\ for API errors
- **FR-05.6.4:** Feature-based and role-based permissions

### API Examples

\\\typescript
const config = {
    config: {
        debug: true,
        pathToApi: 'https://api.example.com',
        pathToLogo: '/logo.png',
        defaultRoute: '/dashboard',
        boot: async (main) => {
            // Load initial data
            const user = await fetch('/api/auth/me');
            main.User().set(user);
            
            const features = await fetch('/api/features');
            main.Store().set('features', features);
        },
        profile: {
            name: (main) => main.User().get('name'),
            email: (main) => main.User().get('email'),
            avatar: (main) => main.User().get('avatar'),
            logout: (main) => {
                localStorage.clear();
                window.location.href = '/login';
            }
        }
    },
    sections: {
        '/dashboard': {
            component: Dashboard,
            icon: <DashboardOutlined />,
            title: 'Dashboard'
        },
        '/users': {
            component: Users,
            icon: <UserOutlined />,
            title: 'Users',
            access: { feature: 'Users', level: 2 }
        }
    }
};

// Usage in components
function MyComponent() {
    const main = useMain(); // Hooks API (Tier 2)
    
    const currentUser = main.User().get('name');
    const features = main.Store().get('features');
    
    return <div>Welcome, {currentUser}</div>;
}
\\\

### Acceptance Criteria
- [ ] Boot sequence loads data before first render
- [ ] Routing works with React Router 7
- [ ] User state management works
- [ ] Store persists across page reloads (optional)
- [ ] HTTP configuration applies globally
- [ ] Access control integrates with components

---

## FR-06: Formula/Action System (Tier 2)

**Priority:** Tier 2 (High Priority)  
**Complexity:** Medium  
**Usage:**  (Form handling)

### Description
Declarative form submission and action handling with validation and lifecycle hooks.

### Functional Requirements

#### FR-06.1: Formula Model
- **FR-06.1.1:** Accept \Post\ model for submission
- **FR-06.1.2:** Collect form values from parent Section
- **FR-06.1.3:** Support validation before submission
- **FR-06.1.4:** Support \onThen()\ success callback
- **FR-06.1.5:** Support \onCatch()\ error callback
- **FR-06.1.6:** Support loading state during submission

#### FR-06.2: Action Model
- **FR-06.2.1:** Support \key()\ for unique identifier
- **FR-06.2.2:** Support \label()\ for button text
- **FR-06.2.3:** Support \icon()\ for button icon
- **FR-06.2.4:** Support \type()\ for button style
- **FR-06.2.5:** Support \formula()\ for form submission
- **FR-06.2.6:** Support \callback()\ for custom logic
- **FR-06.2.7:** Support \confirm()\ for confirmation dialog
- **FR-06.2.8:** Support \access()\ for permission check
- **FR-06.2.9:** Support \disabled()\ for conditional disable

### API Examples

\\\typescript
const section = new Section()
    .formula(new Formula(new Post<User>()
        .target('/api/users')
        .onThen((user) => {
            message.success('User created');
            navigate(\/users/\\);
        })
        .onCatch((error) => {
            message.error(error.message);
        })))
    .add(new Input().key('name').required(true))
    .add(new Button().label('Save').type('primary'));

const deleteAction = new Action()
    .key('delete')
    .label('Delete')
    .icon(<DeleteOutlined />)
    .type('danger')
    .confirm('Are you sure you want to delete this user?')
    .access({ feature: 'Users', level: 3 })
    .formula(new Formula(new Post<void>()
        .target(\/api/users/\\)
        .method('DELETE')
        .onThen(() => list.refresh())));
\\\

### Acceptance Criteria
- [ ] Formula collects form values correctly
- [ ] Validation prevents submission with errors
- [ ] Loading state shows during submission
- [ ] Success/error callbacks execute
- [ ] Confirmation dialog works for destructive actions
- [ ] Access control prevents unauthorized actions

---

## FR-07: TypeScript Generics (Tier 1)

**Priority:** Tier 1 (Must Have)  
**Complexity:** High  
**Usage:** N/A (DX requirement)

### Description
Full TypeScript 5.9.2 generic support throughout the API for type safety and IntelliSense.

### Functional Requirements

- **FR-07.1:** All components accept generic type parameters
- **FR-07.2:** Type inference works across method chains
- **FR-07.3:** No \any\ types in public API
- **FR-07.4:** Compile-time validation of form keys
- **FR-07.5:** Typed HTTP responses
- **FR-07.6:** Typed event handlers

### API Examples

\\\typescript
// Type-safe List
interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

const list = new List<User>()
    .get(() => new Get<User[]>().target('/api/users'))
    .headerPrepend(new ListHeader<User>()
        .key('name') //  Autocomplete: 'id' | 'name' | 'email' | 'role'
        .render((value, record) => {
            //  value: string, record: User
            return <strong>{value}</strong>;
        }));

// Type-safe Form
interface UserForm {
    name: string;
    email: string;
    role: 'admin' | 'user';
}

const section = new Section<UserForm>()
    .formula(new Formula(new Post<User>()
        .target('/api/users')
        .body((values) => values))) //  values: UserForm
    .add(new Input()
        .key('name') //  Autocomplete: 'name' | 'email' | 'role'
        .label('Name'))
    .add(new Select<'admin' | 'user'>()
        .key('role')
        .options([
            { label: 'Admin', value: 'admin' }, //  Type-checked
            { label: 'User', value: 'user' }
        ]));
\\\

### Acceptance Criteria
- [ ] All public APIs fully typed
- [ ] IntelliSense works in VS Code
- [ ] No type errors with \strict: true\
- [ ] Generic inference doesn't require manual type annotations (where possible)
- [ ] Error messages are clear and helpful

---

## FR-08: Hooks API (Tier 2)

**Priority:** Tier 2 (High Priority)  
**Complexity:** Medium  
**Usage:** N/A (New feature)

### Description
React hooks-based API alongside builder pattern for modern React development.

### Functional Requirements

- **FR-08.1:** \useList()\ hook for list management
- **FR-08.2:** \useForm()\ hook for form handling
- **FR-08.3:** \useMain()\ hook for Main orchestrator access
- **FR-08.4:** \useAccess()\ hook for permission checks
- **FR-08.5:** \useGet()\ / \usePost()\ hooks for HTTP requests
- **FR-08.6:** Full type safety with generics

### API Examples

\\\typescript
// useList hook
function Users() {
    const { data, loading, error, refresh } = useList<User>({
        get: '/api/users',
        columns: [
            { key: 'name', title: 'Name' },
            { key: 'email', title: 'Email' }
        ]
    });
    
    if (loading) return <Spin />;
    if (error) return <Alert message={error.message} type="error" />;
    
    return <List data={data} onRefresh={refresh} />;
}

// useForm hook
function UserForm() {
    const { values, setValues, submit, submitting } = useForm<UserForm>({
        initialValues: { name: '', email: '', role: 'user' },
        onSubmit: async (values) => {
            await fetch('/api/users', {
                method: 'POST',
                body: JSON.stringify(values)
            });
        }
    });
    
    return (
        <form onSubmit={submit}>
            <Input 
                value={values.name}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
            <Button type="primary" loading={submitting}>Save</Button>
        </form>
    );
}

// useMain hook
function Dashboard() {
    const main = useMain();
    const userName = main.User().get('name');
    
    return <h1>Welcome, {userName}</h1>;
}
\\\

### Acceptance Criteria
- [ ] Hooks work with React 19.1.0 features
- [ ] Full type safety with TypeScript 5.9.2
- [ ] Can be used alongside builder pattern
- [ ] State management works correctly
- [ ] No unnecessary re-renders

---

## FR-09: Access Control (Tier 2)

**Priority:** Tier 2 (High Priority)  
**Complexity:** Medium  
**Usage:**  (Common requirement)

### Description
Simplified access control with feature-based and role-based permissions.

### Functional Requirements

- **FR-09.1:** Declarative permission model
- **FR-09.2:** Feature-based access (feature + level)
- **FR-09.3:** Role-based access (admin, user, etc.)
- **FR-09.4:** Component-level access control
- **FR-09.5:** Route-level access control
- **FR-09.6:** API-level access handling

### API Examples

\\\typescript
// Component access
new Button()
    .label('Delete')
    .access({ feature: 'Users', level: 3 })
    .onClick(() => deleteUser());

// Route access
sections: {
    '/admin': {
        component: AdminPanel,
        access: { role: 'admin' }
    }
}

// Simplified access wrapper (no more verbose Access utility)
<Protected feature="Users" level={3}>
    <Button>Delete</Button>
</Protected>
\\\

### Acceptance Criteria
- [ ] Access control works at component, route, and API levels
- [ ] Hidden vs disabled modes supported
- [ ] Clear error messages for access violations
- [ ] Works with hooks API

---

## Cross-Cutting Requirements

### CR-01: Dual API Support
- Support both builder pattern and hooks API
- Components can be used declaratively or imperatively
- Seamless interop between both styles
- Choose best API for each use case

### CR-02: Tree-shaking Support
- Modular exports (`react-antd-admin-panel/list`, `react-antd-admin-panel/form`, etc.)
- Dead code elimination for unused features
- Target bundle size: <400 kB
- Zero unused code in production builds

### CR-03: Ant Design 6 Integration
- Full integration with Ant Design 6.1.0 features
- Support Ant Design 6 theming system
- Use latest component APIs (CSS-in-JS, component tokens)

### CR-04: React 19 Support
- Compatible with React 19.1.0 features
- Support Server Actions (Tier 4 research)
- Use concurrent features where appropriate
- React Compiler ready

### CR-05: Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader support (ARIA labels)
- Focus management

### CR-06: Internationalization
- Support i18n for all built-in strings
- Date/time localization via Ant Design 6
- RTL support

---

## Out of Scope (v2.0)

- **Carousel Component** - Unused in all analyzed projects, use Ant Design directly
- **Graph/Chart Components** - Recommend dedicated visualization library
- **Mobile-specific Components** - Focus on responsive desktop-first
- **Real-time Collaboration** - Too complex for initial release
- **v1 Compatibility** - Clean break, modern solution only

---

## Success Metrics

### Adoption Metrics
- 80% of v1 users migrate within 6 months
- 10+ new projects adopt v2
- 2x GitHub stars

### Quality Metrics
- Bundle <400 kB (vs 645 kB in v1)
- 100% TypeScript type coverage
- 90%+ test coverage
- <100ms List render time (1000 items)

### Developer Experience Metrics
- 95%+ positive sentiment in surveys
- <2 hours from install to productive
- <5 GitHub issues/month

### Documentation Metrics
- Every component has 3 examples
- 100% API reference coverage
- Video tutorials for common tasks

---

## Next Steps

1.  **Functional Requirements** - COMPLETE
2.  **Non-Functional Requirements** - Performance, browsers, accessibility
3.  **Technical Requirements** - Stack, build tools, dependencies
4.  **Migration Requirements** - Compatibility, codemods, guides
5.  **Design Phase** - Architecture, API design, implementation plan

---

**Status:**  IN PROGRESS  
**Last Updated:** December 9, 2025  
**Next:** Create Non-Functional Requirements document
