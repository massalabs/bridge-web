import { BridgeMode } from '../const';

export const tagTypes = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
};

export const MASSA_STATION_INSTALL = 'https://station.massa.net';
export const MASSA_STATION_STORE = 'https://station.massa/web/store';
export const MASSA_EXPLORER_URL = 'https://explorer.massa.net/operation/';
export const MASSA_EXPLO_URL = 'https://massexplo.io/tx/';
export const MASSA_EXPLO_EXTENSION = '?network=buildnet';
export const MASSA_WALLET_CREATE_ACCOUNT =
  'http://station.massa/plugin/massa-labs/massa-wallet/web-app/account-create';
export const BEARBY_INSTALL = 'https://bearby.io';

export const BRIDGE = 'bridge';
export const APPROVE = 'approve';

export enum SIDE {
  MASSA_TO_EVM = 'massaToEvm',
  EVM_TO_MASSA = 'evmToMassa',
}

export enum ClaimState {
  RETRIEVING_INFO = 'retrieving-info', // Relayer are adding signatures
  READY_TO_CLAIM = 'ready-to-claim', // User can claim
  AWAITING_SIGNATURE = 'awaiting-signature', // User clicked on claim button, waiting for signature
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
  REJECTED = 'rejected',
  ALREADY_EXECUTED = 'already-executed',
}

export enum BurnState {
  AWAITING_INCLUSION = 'awaiting-inclusion',
  PENDING = 'included-pending',
  SUCCESS = 'success',
  ERROR = 'error',
  REJECTED = 'rejected',
  INIT = 'init',
  SIGNATURE_TIMEOUT = 'signature-timeout',
  OPERATION_FINALITY_TIMEOUT = 'operation-finality-timeout',
}

// TODO: complete the enums
export enum LockState {}

export enum MintState {
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
}

export const MASSA_FAUCET_LINK = 'https://discord.gg/FS2NVAum';

export const SEPOLIA_FAUCET_LINK = 'https://sepoliafaucet.com/';

export const EVM_EXPLORER = {
  [BridgeMode.mainnet]: 'https://etherscan.io/',
  [BridgeMode.testnet]: 'https://sepolia.etherscan.io/',
};

export const sepoliaChainId = 11155111;
