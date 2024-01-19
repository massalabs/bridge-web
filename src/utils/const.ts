import { BridgeMode } from '../const';

export const tagTypes = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
};

export enum loadingStates {
  loading = 'loading',
  warning = 'warning',
  error = 'error',
  success = 'success',
  none = 'none',
}

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

// Networks
export const SEPOLIA_CHAIN_ID = 11155111;
export const ETH_MAINNET_CHAIN_ID = 1;

export const EVM_EXPLORER = {
  [BridgeMode.mainnet]: 'https://etherscan.io/',
  [BridgeMode.testnet]: 'https://sepolia.etherscan.io/',
};
