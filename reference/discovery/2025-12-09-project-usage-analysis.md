# Discovery Session 2: Project Implementation Analysis

**Status:**  COMPLETE  
**Completed:** December 9, 2025  
**Projects Analyzed:** 4 (panel, itsl, power, sduexpense)

## Executive Summary
Analysis of 4 project implementations reveals distinct usage patterns and evolutionary paths. **itsl** uses NPM package (v1.0.39) directly with extensive custom views. **panel** is the original development repo (v1.0.83 source). **power** represents polished evolution with copied/extended codebase (Ant Design 5.12.1). **sduexpense** is newest but simpler usage with local copy (Ant Design 5.24.5).

## Project Overview Matrix

| Project | Type | Package Usage | Ant Design | Complexity | Key Characteristics |
|---------|------|---------------|------------|------------|-------------------|
| **panel** | Source | Development repo | 5.8.6 | Source | Original package development, v1.0.83 |
| **itsl** | Consumer | NPM v1.0.39 | 4.22.1 | Extensive | Older, uses NPM directly, 25+ views |
| **power** | Fork | Local copy | 5.12.1 | Polished | Copied codebase, extensive customization |
| **sduexpense** | Fork | Local copy | 5.24.5 | Simple | Newest, Azure auth, simpler usage |

## Project 1: panel (Original Development Repo)

### Overview
- **Purpose:** Original package development and testing
- **Version:** 1.0.83 (published version 1.0.95 is ahead)
- **Structure:** Module development with example project

### Key Findings
**Folder Structure:**
\\\
panel/
 development/    # Development/test environment
 example/        # Example implementations
 module/         # Package source code
     src/
         components/     # React components
            App.tsx
            Section.tsx
            Header.tsx
            builder/    # Component implementations
         typescript/     # TypeScript models
             main.ts     # Main orchestrator
             controllers/
             models/
                builder/    # Builder models
                list/       # List models
             utils/
\\\

**Architecture Insights:**
1. **Clear Separation:** TypeScript models (data) vs React components (rendering)
2. **Main Class:** Central orchestrator managing Controller, Store, User, routing
3. **Builder Pattern:** Fluent API through chained methods
4. **Default Base Class:** All builder models extend from \Default\ (~275 lines)
5. **Formula/Action System:** For forms and data mutations

**Core Patterns:**
\\\	ypescript
// Main orchestrator
class Main {
    User, Store, Controller, Function
    \(), \(), \(), \()
    \(), \(), \(), \()
}

// Builder base
class Default {
    // Lifecycle
    _formula, _action, _get
    // UI State
    _style, _label, _disabled, _required
    // Methods
    key(), add(), addMore(), formula(), action()
    get(), fetch(), refresh()
    onChange(), onClick(), onComplete()
}

// Section example
class Section extends Default {
    col(), row(), card(), overlay()
    addRowEnd(), addRowStart()
    immediate(), async()
}
\\\

### Version Drift
- Module at v1.0.83
- NPM published at v1.0.95
- 12 versions of drift between dev and published

---

## Project 2: itsl (Extensive NPM Consumer)

### Overview
- **Type:** Production application using NPM package
- **Package:** react-antd-admin-panel@^1.0.39 (56 versions behind!)
- **Ant Design:** 4.22.1 (older version)
- **Complexity:** High - 25+ view files

### Key Findings
**Usage Pattern:**
\\\	ypescript
// index.tsx - Simple bootstrap
import { App } from 'react-antd-admin-panel';
root.render(<App config={config}/>);
\\\

**Config-Driven Architecture:**
\\\	ypescript
// config.ts (784 lines!)
export default {
  config: {
    debug, drawer, pathToApi, pathToLogo,
    defaultRoute, profile, access, boot
  },
  sections: {
    // Route definitions with icons, components
    '/scheduled/:faculty': { ... },
    '/users/:faculty': { ... },
    // 20+ routes
  }
}
\\\

**View Structure (Users.tsx example):**
\\\	ypescript
// Imports from package
import {
    ListHeader, Section, List, Get, Post,
    Main, ListItem, Typography, Button,
    Action, Formula, Checkbox, Input
} from "react-antd-admin-panel";

// Build declarative UI
const section = new Section();
const list = new List()
    .get(() => new Get().target('/api/users'))
    .expandable(() => true)
    .expandableSection((item) => userRoles(item))
    .headerCreate(false)
    .headerPrepend(new ListHeader()
        .key('name')
        .render((v, o) => <>{v}</>))
    .actions(new Action()
        .key('deleteConfirm')
        .formula(new Formula(new Post()
            .target('/api/delete')
            .onThen(() => list.refresh()))));
\\\

**Custom Extensions:**
1. **helpers.ts:** Utility functions for data transformation
2. **texts.ts:** Internationalization strings
3. **Custom components:** Popover-based UI for complex interactions
4. **Mixing Ant Design direct:** Uses Ant components alongside package

**Access Control Pattern:**
\\\	ypescript
config.access = {
    access: (args, main, cycle) => {
        // Feature-based permissions
        // Faculty-level access
        // Admin overrides
        return { hidden: boolean, access: boolean };
    },
    accessViolationRoute: (main, cycle) => { /* redirect */ },
    accessViolationApi: (main) => { /* show message */ }
}
\\\

**Boot Sequence:**
\\\	ypescript
boot: (main, next) => {
    // Parallel data loading
    Promise.all([
        GET /api/user,
        GET /api/system/faculties,
        GET /api/system/features,
        GET /api/system/cities,
        GET /api/system/semesters
    ]).then(() => next());
}
\\\

**Pain Points Observed:**
1. **Heavy config file:** 784 lines, hard to maintain
2. **Version lag:** Using v1.0.39 (56 versions old)
3. **Mixed paradigm:** Package patterns + direct Ant Design
4. **No TypeScript for views:** Uses .tsx but not fully typed
5. **Complex access logic:** Embedded in config

---

## Project 3: power (Polished Fork)

### Overview
- **Type:** Full-stack app with copied/evolved package code
- **Package:** Local copy in \rontend/src/typescript/\
- **Ant Design:** 5.12.1 (upgraded from v1 package's 5.8.6)
- **Backend:** Laravel with Sanctum auth
- **Maturity:** Most polished implementation

### Key Findings
**Why Copied?**
- Need for customization beyond package capabilities
- Version control over core functionality
- Ability to extend/modify base classes
- Deploy independence

**Architecture:**
\\\
frontend/src/
 typescript/          # Copied and evolved package
    controllers/
    models/
       builder/
       list/
    utils/
    main.ts
    index.ts
 components/          # Custom components
    App.tsx
    Section.tsx
    [custom]
 addons/             # Project-specific extensions
    elements/
 views/              # Feature views
    Admin/
    Moderator/
    Readers/
    Dataist/
 config.ts           # App configuration
 helpers.ts          # Utilities
\\\

**Enhanced Usage Pattern:**
\\\	ypescript
// Import from local typescript/ folder
import {
    Action, Button, Default, Get, Input,
    Main, Route, Section, Sider, Typography,
    Formula, Post, Space
} from './typescript/index';

// Build complex UIs
const listForUserRoles = new List()
    .get(() => dataUserRoles)
    .footer(false)
    .headerCreate(false)
    .headerPrepend(new ListHeader()
        .key('role')
        .title('Role')
        .render(v => <>{v?.name ?? ''}</>))
    .emptyText('')
    .emptyIcon(WarningOutlined)
    .emptyColumn(true)
    .actions(new Action()
        .key('deleteConfirm')
        .formula(new Formula(new Post()
            .target((args) => ({
                method: 'delete',
                target: \/api/userRoles/\\
            }))
            .onThen(() => {
                message.success('Rækken blev slettet.')
                list.refresh(() => {});
            }))));
\\\

**Custom Extensions:**
1. **addons/elements/:** Custom UI components (LoginHeader, etc.)
2. **helpers.ts/js:** Dual files for TypeScript and JavaScript utilities
3. **classes.ts/js:** Additional class definitions
4. **Advanced routing:** More complex access control patterns

**Laravel Integration:**
\\\	ypescript
axios.defaults.baseURL = config.config.pathToApi;
axios.defaults.withCredentials = true; // Sanctum CSRF
// After calling /sanctum/csrf-cookie
// Then /login with credentials
\\\

**Improvements Over itsl:**
1. **Modular config:** Cleaner, more focused
2. **Better TypeScript:** Dual .ts/.js files for compatibility
3. **Custom addons:** Extensibility layer
4. **Organized views:** By role (Admin, Moderator, Readers, Dataist)
5. **Production deployment:** Build scripts, deployment automation

---

## Project 4: sduexpense (Newest Simple Usage)

### Overview
- **Type:** Azure AD authenticated expense system
- **Package:** Local copy in \src/typescript/\
- **Ant Design:** 5.24.5 (most recent)
- **Auth:** @azure/msal-browser + @azure/msal-react
- **Complexity:** Simple usage of package features

### Key Findings
**Modern Stack:**
\\\json
{
  "antd": "^5.24.5",           // Latest Ant Design
  "@azure/msal-browser": "^3.16.0",
  "@azure/msal-react": "^2.0.18",
  "react-pdf": "^9.2.1",        // PDF handling
  "pdfjs-dist": "^5.4.296"
}
\\\

**Azure Integration:**
\\\	ypescript
// MSAL configuration
const msalInstance = new PublicClientApplication(msalConfig);

// Auth wrapper
<MsalProvider instance={msalInstance}>
    <AuthenticatedTemplate>
        <App config={config}/>
    </AuthenticatedTemplate>
    <UnauthenticatedTemplate>
        <Login/>
    </UnauthenticatedTemplate>
</MsalProvider>
\\\

**Simpler Usage:**
- Fewer complex interactions
- Standard CRUD operations
- Less custom extensions
- Focus on business logic over framework complexity

**Why Still Copied?**
1. **Control:** Even simple usage benefits from local control
2. **Customization:** Small tweaks still needed
3. **Dependencies:** Ant Design version management
4. **Consistency:** Same pattern as other projects

---

## Cross-Project Patterns

### Common Usage Patterns

#### 1. Declarative List Building
All projects use similar list patterns:
\\\	ypescript
new List()
    .get(() => new Get().target('/api/data'))
    .headerPrepend(new ListHeader().key('name').title('Name'))
    .headerPrepend(new ListHeader().key('status').title('Status'))
    .expandable(() => true)
    .expandableSection((item) => detailSection(item))
    .actions(new Action().key('delete').formula(...))
    .footer(false)
\\\

#### 2. Form with Formula
\\\	ypescript
const section = new Section().formula(new Formula(
    new Post()
        .target('/api/save')
        .onThen(() => message.success('Saved'))
));

section.add(new Input().key('name').label('Name').required(true));
section.add(new Select().key('type').label('Type'));
\\\

#### 3. Conditional Rendering
\\\	ypescript
const condition = new Conditions()
    .add(new ConditionsItem()
        .condition(() => dataLoaded)
        .success(() => new Section().add(contentSection))
        .error(() => new Section().add(loadingSection)));
\\\

#### 4. Access Control
\\\	ypescript
new Button()
    .access({ feature: 'Users', level: 3 })
    .action(new Action().callback(() => doSomething()));

// Or via Access utility
new Access(main)
    .action(new Action().access({ feature: 'Users', level: 3 }), record)
    .render((v) => <Component {...v}/>);
\\\

### Why Projects Forked (Copy/Paste)

#### From itsl (NPM)  power/sduexpense (Local Copy)

**Reasons Identified:**
1. **Customization Needs:**
   - Extend base classes with project-specific methods
   - Modify internal behaviors without PR/wait cycle
   - Add features not in roadmap

2. **Version Control:**
   - Lock to specific working version
   - Avoid breaking changes from package updates
   - Control upgrade timing

3. **Dependency Management:**
   - Upgrade Ant Design independently (4.x  5.x)
   - Manage React version transitions
   - Control peer dependency versions

4. **Build Integration:**
   - Optimize bundle size through dead code elimination
   - Customize build process
   - Remove unused features

5. **Development Speed:**
   - No waiting for package updates
   - Immediate bug fixes
   - Rapid iteration

### Common Pain Points

#### 1. Configuration Complexity
- **itsl:** 784-line config file
- **Solution needed:** Config modularity, type safety

#### 2. TypeScript Ergonomics
- Builder pattern creates long chains
- Type inference breaks with complex nesting
- **Example:** \
ew Section().add(new List().get(() => new Get()...)))\

#### 3. Mixed Paradigms
Projects mix:
- Package declarative API
- Direct Ant Design components
- Custom React components
**Leads to:** Inconsistency, confusion for new developers

#### 4. Documentation Gap
- Minimal package docs
- Learning by example from other projects
- No API reference or guides

#### 5. List Extensions Underutilized
- Package has ListActions, ListEdit, ListMenu, ListSearch
- Projects rarely use them
- Build custom solutions instead

#### 6. Access Control Verbosity
\\\	ypescript
// Current
new Button()
    .access({ feature: 'Users', level: 3 })
    .action(...)

// Repeated everywhere, hard to maintain
\\\

### Successful Patterns

#### 1. Helper Utilities
All projects have helper files for:
- Data transformation
- Enum conversions
- Common operations

#### 2. Config-Based Routing
\\\	ypescript
sections: {
    '/path/:param': {
        component: View,
        icon: IconComponent,
        title: 'Title',
        access: { feature: 'X', level: 2 }
    }
}
\\\

#### 3. Reusable Section Builders
\\\	ypescript
function userRolesSection(item, main) {
    return (next) => {
        const section = new Section();
        // ... build complex section
        next(section);
    };
}
\\\

#### 4. Addon/Extensions Folder
**power** pattern: \ddons/elements/\ for project-specific components

---

## Key Insights for v2

### Must Keep
1. **Declarative Builder Pattern:** Core strength, keep and improve
2. **Main Orchestrator:** Central point of control
3. **Formula/Action System:** Elegant form handling
4. **Get/Post Models:** HTTP abstraction works well
5. **List Component:** Most used, most valuable
6. **Access Control Concept:** Right idea, needs better DX

### Must Improve
1. **TypeScript Experience:**
   - Better type inference
   - Generics for type safety
   - Reduce \ny\ usage

2. **Configuration:**
   - Modular config system
   - Type-safe config objects
   - Reduce boilerplate

3. **Documentation:**
   - Comprehensive API docs
   - Usage examples for all components
   - Migration guides

4. **Extensibility:**
   - Plugin system for custom components
   - Easier to extend base classes
   - Theme customization

5. **Bundle Size:**
   - Tree-shakeable exports
   - Optional features
   - Reduce dependencies

6. **List Extensions:**
   - Make easier to discover and use
   - Better defaults
   - More examples

### New Features to Consider
1. **Hooks API:** Alongside builder pattern
2. **Composition Helpers:** Pre-built patterns
3. **Dev Tools:** Debug panel, state inspection
4. **Testing Utilities:** Mock builders, test helpers
5. **Theme System:** Consistent styling API
6. **Validation:** Built-in validation beyond required

### Ant Design Integration
- **Current:** Ant Design 4.x-5.x across projects
- **v2 Target:** Ant Design 5.x latest stable
- **Opportunity:** Better Ant Design 5 features integration (CSS-in-JS, new components)

---

## Next Steps

### Discovery Session 3: Consolidation
1. Map common features across all projects
2. Identify universally needed extensions
3. Research React/Ant Design best practices (2024-2025)
4. Create feature priority matrix

### Requirements Phase
1. Extract core requirements from usage patterns
2. Define v2 scope boundaries
3. List breaking changes vs compatibility
4. Create migration strategy

### Design Phase
1. API design for improved DX
2. Architecture for better tree-shaking
3. Plugin/extension system design
4. TypeScript-first implementation plan

---

**Files Referenced:**
- \/reference/repos/itsl/\ - NPM consumer
- \/reference/repos/panel/\ - Original source
- \/reference/repos/power/\ - Polished fork
- \/reference/repos/sduexpense/\ - Newest fork

**Status:** Ready for Discovery Session 3 - Consolidation Analysis

