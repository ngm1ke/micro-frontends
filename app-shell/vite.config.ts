import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "host_app",
      remotes: {
        react_remote_app: {
          type: "module",
          name: "react_remote_app",
          entry: "http://localhost:5001/remoteEntry.js",
        },
        vue_remote_app: {
          type: "module",
          name: "vue_remote_app",
          entry: "http://localhost:5002/remoteEntry.js",
        },
      },
      shared: ["react", "react-dom"],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
