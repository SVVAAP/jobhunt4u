import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build:{
    outDir:'dist'
  },
  server: {
    port: 3000,  // Define the port for the development server
    open: true  // Automatically open the browser when the server starts
  }
})
