# Technical Requirements - react-antd-admin-panel v2

**Version:** 2.0.0  
**Target Stack:** React 19.1.0, TypeScript 5.9.2, Ant Design 6.1.0  
**Status:**  COMPLETE  
**Created:** December 9, 2025

## TR-01: Core Stack (Latest Only)
- **React:** 19.1.0+ (concurrent rendering, React Compiler ready)
- **TypeScript:** 5.9.0+ (strict mode enforced, advanced generics)
- **Ant Design:** 6.1.0+ (CSS-in-JS, component tokens, latest features)
- **React Router:** 7.0.0+ (data APIs, loaders, modern routing)

## TR-02: Build Tools (Modern Stack)
- **Vite:** 6.x (primary, fast HMR, optimal DX)
- **Rollup:** 4.x (package bundling, perfect tree-shaking)
- **TypeScript Compiler:** Latest with strict configuration

## TR-03: Dependencies
- axios: ^1.7.0 (HTTP client)
- dayjs: ^1.11.0 (date library, 2kB)
- react-router-dom: ^7.0.0

## TR-04: Dev Dependencies
- vitest: ^2.0.0 (testing)
- @testing-library/react: ^16.0.0
- eslint: ^9.0.0
- prettier: ^3.0.0
- storybook: ^8.0.0 (component gallery)

## TR-05: Node.js
- Minimum: 20.0.0 LTS
- CI/CD: 20.x

## TR-06: Browser Support
- Chrome: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Edge: Last 2 versions
- NO IE11

## TR-07: Package Structure
Modular exports for tree-shaking:
- react-antd-admin-panel/list
- react-antd-admin-panel/form
- react-antd-admin-panel/http
- sideEffects: false

**Status:**  COMPLETE
