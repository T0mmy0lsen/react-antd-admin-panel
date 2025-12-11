import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      'react-antd-admin-panel/auth': resolve(__dirname, '../core/src/auth/index.ts'),
      'react-antd-admin-panel/testing': resolve(__dirname, '../core/src/testing/index.ts'),
      'react-antd-admin-panel/list': resolve(__dirname, '../core/src/list/index.ts'),
      'react-antd-admin-panel/form': resolve(__dirname, '../core/src/form/index.ts'),
      'react-antd-admin-panel/http': resolve(__dirname, '../core/src/http/index.ts'),
      'react-antd-admin-panel/hooks': resolve(__dirname, '../core/src/hooks/index.ts'),
      'react-antd-admin-panel/main': resolve(__dirname, '../core/src/main/index.ts'),
      'react-antd-admin-panel/section': resolve(__dirname, '../core/src/section/index.ts'),
      'react-antd-admin-panel/access': resolve(__dirname, '../core/src/access/index.ts'),
      'react-antd-admin-panel/formula': resolve(__dirname, '../core/src/formula/index.ts'),
      'react-antd-admin-panel/action': resolve(__dirname, '../core/src/action/index.ts'),
      'react-antd-admin-panel': resolve(__dirname, '../core/src/index.ts'),
    },
  },
});
