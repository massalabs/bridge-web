/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENV: string;
  readonly VITE_LAMBDA_URL: string;
  readonly VITE_CLAIM_GAS_COST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
