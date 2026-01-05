import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
      jsxImportSource: "@emotion/react",
    }),
  ],
  server: {
    allowedHosts: ["0.tcp.jp.ngrok.io"],
  },
});
