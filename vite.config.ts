import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    lib: { entry: 'frontend/main.ts', formats: ['es'], fileName: () => 'libremap.js', cssFileName: 'libremap' },
    outDir: 'dist',
    sourcemap: true,
  },
  worker: { format: 'es' },
});
