/// <reference types="vite/client" />

interface ImportMetaEnv extends Readonly<Record<string, string | boolean | undefined>> {
  readonly VITE_BUILD_TIMESTAMP: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
