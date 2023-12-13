export const tagTypes = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
};

export const MASSA_STATION_INSTALL = 'https://station.massa.net/';
export const MASSA_STATION_URL = 'https://station.massa';
export const linkToCreateAccount =
  'https://station.massa/plugin/massa-labs/massa-wallet/web-app/index';

export const BRIDGE = 'bridge';
export const APPROVE = 'approve';

export const MASSA_TO_EVM = 'massaToEvm';
export const EVM_TO_MASSA = 'evmToMassa';

export const MASSA_FAUCET_LINK = 'https://discord.gg/FS2NVAum';

export const SEPOLIA_FAUCET_LINK = 'https://sepoliafaucet.com/';

export const BRIDGE_ACCOUNT_ADDRESS = 'massa-bridge-account-address';

export const BRIDGE_TOKEN = 'massa-bridge-token';

// Error const

export interface ICustomError extends Error {
  cause?: {
    error: string;
    details: string;
  };
}

export const ERRORS_MESSAGES = [
  'unable to unprotect wallet',
  'TransactionExecutionError: User rejected the request',
];

export const WARNING_MESSAGES = [
  'signing operation: calling executeHTTPRequest for call: aborting during HTTP request',
];

export const regexErr = new RegExp(ERRORS_MESSAGES.join('|'), 'i');
export const regexWarn = new RegExp(WARNING_MESSAGES.join('|'), 'i');
