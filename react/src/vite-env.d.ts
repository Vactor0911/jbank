/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
