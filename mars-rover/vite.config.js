import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: "./testSetup.js",
    environment: "jsdom",
  },
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
});
