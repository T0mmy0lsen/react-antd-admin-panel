import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3004,
  },
  resolve: {
    alias: {
      'react-antd-admin-panel': resolve(__dirname, '../core/src/index.ts'),
    },
  },
});
