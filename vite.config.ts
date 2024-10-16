   // vite.config.ts
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';

   export default defineConfig({
     plugins: [react()],
     server: {
       proxy: {
         '/api': {
           target: 'https://127.0.0.1:8089', // Your backend server
           changeOrigin: true,
           secure: false, // Disable SSL verification
           rewrite: (path) => path.replace(/^\/api/, ''),
         },
       },
     },
   });