import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("vis-network") || id.includes("vis-data")) {
            // Split the vis-network package into smaller chunks
            const moduleName = id.split("/").pop()?.split(".")[0];
            return moduleName ?? "vis-network"; // Create chunks based on the module name, ensuring a default chunk if moduleName is undefined
          }
          // Other manual chunking logic can go here
        },
      },
    },
  },
});
