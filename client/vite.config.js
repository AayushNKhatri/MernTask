// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Or your framework plugin
import tailwindcss from '@tailwindcss/postcss'; // Import tailwindcss plugin
import autoprefixer from 'autoprefixer';       // Import autoprefixer

export default defineConfig({
  plugins: [react()], // Your existing plugins
  css: {
    postcss: {
      plugins: [
        tailwindcss(), // Call it as a function
        autoprefixer(),  // Call it as a function
      ],
    },
  },
});