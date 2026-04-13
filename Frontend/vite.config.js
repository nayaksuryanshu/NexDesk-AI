import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  server:
    mode === 'development'
      ? {
          proxy: {
            '/api': {
              target: 'http://localhost:5000',
              changeOrigin: true,
            },
          },
        }
      : undefined,
}))
