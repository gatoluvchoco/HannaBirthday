import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  // Determine base path:
  // 1. Explicit BASE_PATH from GitHub Actions configure-pages
  // 2. GITHUB_REPOSITORY environment variable (e.g. "user/repo" -> "/repo/")
  // 3. Fallback to './'
  let base = process.env.BASE_PATH || process.env.VITE_BASE_PATH;
  if (!base && process.env.GITHUB_REPOSITORY && !process.env.GITHUB_REPOSITORY.endsWith('.github.io')) {
    const repoName = process.env.GITHUB_REPOSITORY.split('/')[1];
    if (repoName) {
      base = `/${repoName}/`;
    }
  }
  if (!base) {
    base = './';
  }

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
