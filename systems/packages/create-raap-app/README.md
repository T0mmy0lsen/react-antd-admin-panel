# create-raap-app

> CLI to scaffold React Antd Admin Panel projects

[![npm version](https://img.shields.io/npm/v/create-raap-app.svg)](https://www.npmjs.com/package/create-raap-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Quickly create a new admin panel project with [react-antd-admin-panel](https://www.npmjs.com/package/react-antd-admin-panel).

## Usage

```bash
npx create-raap-app my-admin-app
```

Or with npm:

```bash
npm create raap-app my-admin-app
```

## Templates

### Basic (default)

Minimal setup with:
- React 19 + TypeScript
- Vite for development
- Ant Design 6
- react-antd-admin-panel
- Basic routing setup
- Example List component

```bash
npx create-raap-app my-app --template basic
```

### Auth

Everything in Basic plus:
- Authentication setup
- Login page
- Protected routes
- User context
- JWT token handling example

```bash
npx create-raap-app my-app --template auth
```

## Options

```bash
npx create-raap-app <project-name> [options]

Options:
  -t, --template <name>  Template to use (basic, auth) [default: basic]
  -h, --help            Display help
  -V, --version         Display version
```

## What's Included

Each template includes:

```
my-app/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## After Creation

```bash
cd my-app
npm install
npm run dev
```

Then open http://localhost:5173 to see your app.

## Requirements

- Node.js 18+
- npm, yarn, or pnpm

## Related

- [react-antd-admin-panel](https://www.npmjs.com/package/react-antd-admin-panel) - The core library
- [Ant Design](https://ant.design/) - UI component library

## License

MIT