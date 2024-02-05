const {
  VITE_BRIDGE_OFF,
  VITE_REDEEM_OFF,
  VITE_SC_DEPLOY,
  VITE_NO_BRIDGE,
  VITE_IS_MAIN,
} = import.meta.env;

const isMainBranch = VITE_IS_MAIN === 'true';

export const BRIDGE_OFF = isMainBranch && VITE_BRIDGE_OFF === 'true';

export const REDEEM_OFF = isMainBranch && VITE_REDEEM_OFF === 'true';

export const SC_DEPLOY = isMainBranch && VITE_SC_DEPLOY === 'true';

export const NO_BRIDGE = isMainBranch && VITE_NO_BRIDGE === 'true';
