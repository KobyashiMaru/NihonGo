import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // The Whisper speech worker imports transformers.js, which needs ES module workers
  worker: {
    format: 'es',
  },
  // Cross-origin isolation lets the speech model run on several CPU threads (SharedArrayBuffer).
  // 'credentialless' keeps cross-origin assets such as Google Fonts loading without CORP headers.
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
  // Pre-bundle it at startup; otherwise Vite discovers it on first mic use and reloads the page
  optimizeDeps: {
    include: ['@huggingface/transformers'],
  },
})

