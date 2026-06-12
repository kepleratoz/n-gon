import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [viteSingleFile()],
  build: {
    target: 'es2015',
    minify: false,
    rollupOptions: {
      input: '/index.html'
    }
  }
});
