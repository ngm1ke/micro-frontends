import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { federation } from "@module-federation/vite";
console.log("react-remote-app")
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "detail",
      filename: "remoteEntry.js",
      // TODO:
      remotes: {
        cart: {
          type: "module",
          name: "cart",
          entry: "http://localhost:8002/remoteEntry.js",
        },
      },
      exposes: {
        "./ProductDetail": "./src/components/ProductDetail",
      },
      shared: ["react", "react-dom"],
      dts: false,
      bundleAllCSS: true,
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  preview: {
    port: 8001,
    strictPort: true,
    cors: true,
  },
  server: {
    port: 8001,
    strictPort: true,
    cors: true,
  },
});
