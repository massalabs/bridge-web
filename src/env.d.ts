/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENV: string;
  readonly VITE_LAMBDA_URL: string;
  readonly VITE_CLAIM_GAS_COST: string;
  readonly VITE_LOCK_GAS_COST: string;
  readonly VITE_IS_MAIN: string;
  readonly VITE_BRIDGE_OFF: string;
  readonly VITE_REDEEM_OFF: string;
  readonly VITE_SC_DEPLOY: string;
  readonly VITE_NO_BRIDGE: string;
  readonly VITE_INFURA_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
