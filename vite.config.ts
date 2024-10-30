/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { compression } from 'vite-plugin-compression2'
import { qrcode } from 'vite-plugin-qrcode'
import { coverageConfigDefaults, defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  envDir: './env/',
  plugins: [
    react(),
    qrcode(),
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
  ],
  test: {
    globals: true,
    watch: false,
    environment: 'happy-dom',
    setupFiles: './src/setup-test.ts',
    coverage: {
      provider: 'v8',
      exclude: [
        ...coverageConfigDefaults.exclude,
        'commitlint.config.ts',
        '**/public/**',
        'src/main.tsx',
        'src/serviceWorker.ts',
        'src/App/index.ts',
        '**/src/__mocks__/**',
        'src/reportWebVitals.ts',
      ],
    },
  },
  build: {
    sourcemap: true,
    target: 'esnext',
    minify: true,
    cssTarget: 'esnext',
    cssMinify: true,
    cssCodeSplit: true,
    modulePreload: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react/jsx-runtime', 'react-dom'],
        },
      },
    },
  },
})
