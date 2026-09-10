import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    lib: { entry: 'frontend/main.ts', formats: ['es'], fileName: () => 'libremap.js', cssFileName: 'libremap' },
    outDir: 'dist',
    // Maps stay local (see .gitignore); 'hidden' omits the sourceMappingURL
    // comment so hosts never request a file the package does not ship.
    sourcemap: 'hidden',
  },
  worker: { format: 'es' },
});
