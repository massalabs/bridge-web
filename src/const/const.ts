export const MASSA_WALLET_PROVIDER = 'massaWalletProvider';
export const METAMASK = 'Metamask';

export enum Blockchain {
  ETHEREUM = 'Ethereum',
  EVM_MAINNET = 'Mainnet',
  EVM_TESTNET = 'Testnet',
  MASSA = 'Massa',
  MASSA_BUILDNET = 'Buildnet',
  MASSA_MAINNET = 'Mainnet',
  BSC = 'Binance smart chain',
  TBSC = 'BSC Testnet',
  BSC_MAINNET = 'Mainnet',
  BSC_TESTNET = 'Testnet',
  INVALID_CHAIN = 'Invalid-chain',
  UNKNOWN = 'Unknown',
}

// SMART CONTRACTS ADDRESSES
export const TDAI_CONTRACT_ADDRESS =
  '0x53844F9577C2334e541Aec7Df7174ECe5dF1fCf0';

export const WETH_CONTRACT_ADDRESS =
  '0xf6E9FBff1CF908f6ebC1a274f15F5c0985291424';

export const U256_MAX = BigInt(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
);

export enum BridgeMode {
  mainnet = 'mainnet',
  testnet = 'testnet',
}

export const config = {
  [BridgeMode.mainnet]: {
    evmBridgeContract: '' as `0x${string}`,
    massaBridgeContract: '',
    lambdaUrl:
      'https://gfltuhv4oouk5qs6jf7lv7tvp40vfwsj.lambda-url.eu-west-3.on.aws/',
    wmas_address: '0xDc074966De429c92614769Dc6546A8E72E83175D' as `0x${string}`,
  },
  [BridgeMode.testnet]: {
    evmBridgeContract:
      '0xB06f330fbdfEA88F0e8b6926505226c981b324f6' as `0x${string}`,
    massaBridgeContract: 'AS1Y1zNtZRUruRuqwN47YaYiEdD8gEoXjrEKKnA19X1BFypRGEqM',
    lambdaUrl:
      'https://6sul7w7nqer7pd5mf7cl6l2muy0isblj.lambda-url.eu-west-3.on.aws/default/',
    wmas_address: '0x3C53552D3A54672fe1113e2FDDd2099d6E9E585D' as `0x${string}`,
  },
};

export const AVAILABLE_MODES = [BridgeMode.mainnet, BridgeMode.testnet];

// Transaction fees
export const forwardBurnFees = {
  fee: 0n,
  coins: 0n,
};

export const increaseAllowanceFee = {
  fee: 0n,
};

export enum SupportedTokens {
  tDai = 'tDAI',
  WETH = 'WETH',
}

export const MASSA_TOKEN = 'MAS';

export enum SUPPORTED_MASSA_WALLETS {
  MASSASTATION = 'MASSASTATION',
  BEARBY = 'BEARBY',
}

export const WAIT_STATUS_TIMEOUT = 300_000;
export const STATUS_POLL_INTERVAL_MS = 1000;

export const TIMEOUT = 'timeout';
