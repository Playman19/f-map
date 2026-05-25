import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag === 'ol-map-widget'
          }
        }
      })
    ],

    define: {
      API_URL: JSON.stringify(env.VITE_API_BASE_URL),
      THREAD_LINK: JSON.stringify(env.VITE_THREAD_BASE_LINK),
      ICONS_BASE_URL: JSON.stringify(env.VITE_ICONS_BASE_URL),
    },

    build: {
      lib: {
        entry: './src/main.ce.js',
        formats: ['es'],
        fileName: () => 'ol-map-widget.js'
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue'
          }
        }
      }
    }
  }
})