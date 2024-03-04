export const MASSA_WALLET_PROVIDER = 'massaWalletProvider';
export const METAMASK = 'Metamask';

export enum Blockchain {
  ETHEREUM = 'Ethereum',
  EVM_MAINNET = 'Mainnet',
  EVM_TESTNET = 'Testnet',
  MASSA = 'Massa',
  MASSA_BUILDNET = 'Buildnet',
  MASSA_MAINNET = 'Mainnet',
  CONNECT_WALLET = 'Connect-Wallet',
}

// SMART CONTRACTS ADDRESSES
export const TDAI_CONTRACT_ADDRESS =
  '0x53844F9577C2334e541Aec7Df7174ECe5dF1fCf0';

export const WETH_CONTRACT_ADDRESS =
  '0xf6E9FBff1CF908f6ebC1a274f15F5c0985291424';

export const TDAI_MASSA_ADDRESS =
  'AS1xzTQiRSpq7hNzgPRJcaSLEU4qjaRZPx5JfFVywsJxpWprndtL';

export const WETH_MASSA_ADDRESS =
  'AS12VrdTkW9EAt5ySsnhxKv33gr38hiRm22b63qR7r4h2JQQpzgad';

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
    lambdaUrl: '',
  },
  [BridgeMode.testnet]: {
    evmBridgeContract:
      '0xc784A3df3e4a7613e042e150C26a6Ff7C07104eb' as `0x${string}`,
    massaBridgeContract:
      'AS122W8dgX7WKw2HfMpoGkpQutMcFEikGMPzXnmBujSDHzgnjLtsH',
    lambdaUrl:
      'https://6sul7w7nqer7pd5mf7cl6l2muy0isblj.lambda-url.eu-west-3.on.aws/default/',
  },
};

export const AVAILABLE_MODES = [BridgeMode.mainnet, BridgeMode.testnet];

// Transaction fees
export const forwardBurnFees = {
  fee: 0n,
  coins: 100000n,
  maxGas: 100_000_000n,
};

export const increaseAllowanceFee = {
  fee: 0n,
  coins: 1000n,
  maxGas: 100_000_000n,
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

export enum SUPPORTED_EVM_WALLETS {
  METAMASK = 'MetaMask',
  UNKNOWN = 'Unknown',
}

export const WAIT_STATUS_TIMEOUT = 300_000;
export const STATUS_POLL_INTERVAL_MS = 1000;

export const TIMEOUT = 'timeout';
