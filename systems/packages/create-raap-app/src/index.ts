#!/usr/bin/env node
/**
 * create-raap-app CLI
 * Scaffolds new React Antd Admin Panel projects
 */

import { run } from './cli.js';

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
