import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    root: 'src',
    publicDir: 'public',
    build: {
      outDir: '../dist',
      emptyOutDir: true,
    },
    define: {
      'process.env.VITE_EMAIL_API_URL': JSON.stringify(env.VITE_EMAIL_API_URL || env.WEBPACK_EMAIL_API_URL || ''),
      'process.env.VITE_EMAIL_API_KEY': JSON.stringify(env.VITE_EMAIL_API_KEY || env.WEBPACK_EMAIL_API_KEY || ''),
      'process.env.VITE_EMAIL_TO': JSON.stringify(env.VITE_EMAIL_TO || env.WEBPACK_EMAIL_TO || ''),
    },
    server: {
      port: 3000,
      open: true,
      watch: {
        usePolling: true,
      },
    },
  };
});
