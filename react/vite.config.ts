import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
      jsxImportSource: "@emotion/react",
    }),
    svgr(),
  ],
  server: {
    allowedHosts: ["0.tcp.jp.ngrok.io"],
  },
});
