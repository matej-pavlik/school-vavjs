import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  test: { environment: 'jsdom', setupFiles: './test/setup.js' },
  plugins: [react()],
});
