const { VITE_BRIDGE_OFF, VITE_REDEEM_OFF, VITE_SC_DEPLOY, VITE_NO_BRIDGE } =
  import.meta.env;

export const BRIDGE_OFF =
  VITE_BRIDGE_OFF === 'false' ? false : Boolean(VITE_BRIDGE_OFF) || false;

export const REDEEM_OFF =
  VITE_REDEEM_OFF === 'false' ? false : Boolean(VITE_REDEEM_OFF) || false;

export const SC_DEPLOY =
  VITE_SC_DEPLOY === 'false' ? false : Boolean(VITE_SC_DEPLOY) || false;

export const NO_BRIDGE =
  VITE_NO_BRIDGE === 'false' ? false : Boolean(VITE_NO_BRIDGE) || false;
