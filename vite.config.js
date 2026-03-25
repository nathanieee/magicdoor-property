const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react-swc");
const path = require("path");

module.exports = defineConfig({
  plugins: [react()],
  server: {
    open: true,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5152',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },
});

