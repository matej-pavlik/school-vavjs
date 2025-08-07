import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  test: { environment: 'happy-dom', setupFiles: './test/setup.js' },
  resolve: {
    alias: {
      '@': '/src',
      '@test': '/test',
    },
  },
  plugins: [react()],
});
