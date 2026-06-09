import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    allowedHosts: [".trycloudflare.com"],
    port: 4175,
    proxy: {
      "/api": "http://127.0.0.1:4310"
    }
  },
  preview: {
    host: "0.0.0.0",
    allowedHosts: [".trycloudflare.com"],
    port: 4175
  }
});
