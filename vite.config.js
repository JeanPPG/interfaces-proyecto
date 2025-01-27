import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',  // Esto debería permitir JSX en archivos .js
  },
  server: {
    open: true,
    port: 3000,
  },
});
