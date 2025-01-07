import { defineConfig } from 'vite';
import mkcert from "vite-plugin-mkcert";
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    origin: "https://localhost:3000",
    https: true,
    host: 'localhost',
    port: 3000, // Change the port if needed
  },
});
