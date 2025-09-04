import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    host: true, // Listen on all network interfaces
    open: true,
    strictPort: true, // Exit if port is already in use
    hmr: {
      overlay: true // Show full-screen overlay in the browser when there are errors
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      }
    },
    // Enable detailed logging
    logLevel: 'info',
    // Enable CORS
    cors: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/assets/styles/variables.scss";`
      }
    }
  },
  // Build configuration
  build: {
    // Generate sourcemaps for better debugging
    sourcemap: true,
    // Minify the build
    minify: 'terser',
    // Log build progress
    logLevel: 'info',
    // Configure chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Rollup options
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          'vue': ['vue', 'vue-router', 'vuex'],
          'axios': ['axios']
        }
      }
    }
  },
  // Configure environment variables
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:8000/api')
  }
})
