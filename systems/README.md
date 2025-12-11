# React Antd Admin Panel v2

[![npm version](https://img.shields.io/npm/v/react-antd-admin-panel.svg)](https://www.npmjs.com/package/react-antd-admin-panel)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-6-blue.svg)](https://ant.design/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Modern TypeScript-first React admin panel builder with Ant Design 6.

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [react-antd-admin-panel](./packages/core) | 2.1.0 | Core library with builders |
| [create-raap-app](./packages/create-raap-app) | 2.1.0 | CLI scaffolding tool |
| [example](./packages/example) | 2.1.0 | Demo application |

## Quick Start

```bash
# Create a new project
npx create-raap-app my-admin-app
cd my-admin-app
npm install
npm run dev
```

Or install in an existing project:

```bash
npm install react-antd-admin-panel antd @ant-design/icons
```

## Features

- 🏗️ **Builder Pattern** - Fluent, chainable API for building UI components
- 📘 **TypeScript First** - Full type safety with generics throughout
- ⚛️ **React 19** - Built for the latest React with hooks support
- 🎨 **Ant Design 6** - Beautiful, production-ready components
- 🌳 **Tree-Shakeable** - Import only what you need
- 🪝 **Hooks API** - Modern React hooks alongside builders
- ♿ **Accessible** - WCAG 2.1 AA compliant
- 🧪 **Testing Utilities** - Mock helpers for unit tests

## Project Structure

```
systems/
├── packages/
│   ├── core/              # Main library package
│   │   ├── src/
│   │   │   ├── list/      # List/Table builder
│   │   │   ├── form/      # Form field builders
│   │   │   ├── http/      # HTTP utilities (Get/Post)
│   │   │   ├── main/      # MainProvider & context
│   │   │   ├── hooks/     # React hooks
│   │   │   ├── access/    # Access control
│   │   │   ├── action/    # Action buttons
│   │   │   ├── section/   # Layout sections
│   │   │   ├── formula/   # Conditional rendering
│   │   │   └── testing/   # Test utilities
│   │   └── docs/          # Documentation
│   ├── example/           # Demo application
│   └── create-raap-app/   # CLI tool
├── CHANGELOG.md
└── README.md
```

## Development

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0

### Installation

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run example app
pnpm dev

# Run tests
pnpm test

# Run linting
pnpm lint
```

### Working on core package

```bash
cd packages/core
pnpm dev          # Watch mode
pnpm test:watch   # Test watch mode
pnpm storybook    # Component gallery
```

### Working on example app

```bash
cd packages/example
pnpm dev          # Start dev server
```

## Documentation

- [Core Package README](./packages/core/README.md) - Full API documentation
- [Testing Guide](./packages/core/docs/testing-guide.md) - How to test your app
- [Migration Guide](./packages/core/docs/migration-guide.md) - Upgrading from v1.x
- [CHANGELOG](./CHANGELOG.md) - Version history

## Tech Stack

- **React** 19.1.0+
- **TypeScript** 5.9.2+ (strict mode)
- **Ant Design** 6.1.0+
- **Vite** 6.0+ (dev & build)
- **Vitest** 2.0+ (testing)
- **pnpm** 9.0+ (package manager)

## License

MIT © react-antd-admin-panel contributors
