# React Antd Admin Panel v2

Modern TypeScript-first React admin panel builder with Ant Design 6.

## Project Structure

\\\
systems/
  packages/
    core/              # Core library package
      src/
        types/         # TypeScript type definitions
        base/          # Base builder classes
        list/          # List components
        form/          # Form components
        http/          # HTTP utilities (Get/Post models)
        utils/         # Utility functions
    example/           # Example/test application
      src/
\\\

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0

### Installation

\\\ash
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
\\\

## Development

### Working on core package

\\\ash
cd packages/core
pnpm dev          # Watch mode
pnpm test:watch   # Test watch mode
\\\

### Working on example app

\\\ash
cd packages/example
pnpm dev          # Start dev server on port 3000
\\\

## Tech Stack

- **React** 19.1.0+
- **TypeScript** 5.9.2+ (strict mode)
- **Ant Design** 6.1.0+
- **Vite** 6.0+ (dev & build)
- **Vitest** 2.0+ (testing)
- **pnpm** (package manager)

## Status

Phase 1, Week 1: Project Setup & Infrastructure 

Next: Week 2 - Type System & Base Classes
