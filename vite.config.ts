import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "https://corwinm.github.io/classroom-coordinator/",
  plugins: [react()],
  build: {
    sourcemap: true,
  },
});
