import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '', '')
  return {
    plugins: [react({ jsxImportSource: env.NODE_ENV === 'development' ? "@welldone-software/why-did-you-render" : "react" })]
  }
})
