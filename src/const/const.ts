import { mainnet, sepolia, bsc, bscTestnet } from 'viem/chains';

export const MASSA_WALLET_PROVIDER = 'massaWalletProvider';
export const METAMASK = 'Metamask';

export enum MassaNetworkType {
  Mainnet = 'Mainnet',
  Buildnet = 'Buildnet',
}

export enum Blockchain {
  ETHEREUM = 'Ethereum',
  MASSA = 'Massa',
  BSC = 'BSC',
  UNKNOWN = 'Unknown',
}

// Supported blockchain to bridge from and to
export enum SupportedEvmBlockchain {
  ETH = Blockchain.ETHEREUM,
  BSC = Blockchain.BSC,
}

// Mapping from Supported blockchain to the list of supported chain ids (mainnet and testnets)
export const SUPPORTED_BLOCKCHAIN_TO_CHAIN_IDS: Record<string, number[]> = {
  [SupportedEvmBlockchain.ETH]: [mainnet.id, sepolia.id],
  [SupportedEvmBlockchain.BSC]: [bsc.id, bscTestnet.id],
};

export const CHAIN_ID_TO_SUPPORTED_BLOCKCHAIN: Record<
  number,
  SupportedEvmBlockchain
> = {
  [mainnet.id]: SupportedEvmBlockchain.ETH,
  [sepolia.id]: SupportedEvmBlockchain.ETH,
  [bsc.id]: SupportedEvmBlockchain.BSC,
  [bscTestnet.id]: SupportedEvmBlockchain.BSC,
};

// SMART CONTRACTS ADDRESSES
export const TDAI_CONTRACT_ADDRESS =
  '0x53844F9577C2334e541Aec7Df7174ECe5dF1fCf0';

export const WETH_CONTRACT_ADDRESS =
  '0xf6E9FBff1CF908f6ebC1a274f15F5c0985291424';

export const U256_MAX = BigInt(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
);

export enum BridgeMode {
  mainnet = 'Mainnet',
  testnet = 'Testnet',
}

export const config = {
  [BridgeMode.mainnet]: {
    [SupportedEvmBlockchain.ETH]:
      '0xCD5dcE776c20260D96E2d0C65431f05da4fa8ba1' as `0x${string}`,
    [SupportedEvmBlockchain.BSC]: '0x' as `0x${string}`,
    massaBridgeContract:
      'AS12Kkm5NXHb4xjJJRBDSJiSUsSSbV7DcBCLSS1Zdugz1WdzjVSxg',
    lambdaUrl:
      'https://gfltuhv4oouk5qs6jf7lv7tvp40vfwsj.lambda-url.eu-west-3.on.aws/',
    wmas_address: '0xDc074966De429c92614769Dc6546A8E72E83175D' as `0x${string}`,
  },
  [BridgeMode.testnet]: {
    [SupportedEvmBlockchain.ETH]:
      '0xc6C75C6d637074326ccBb6EDA6dA2fb9976E81eD' as `0x${string}`,
    [SupportedEvmBlockchain.BSC]:
      '0x2975523130cB2824D2774bf964a03e5ff5e4f6C5' as `0x${string}`,
    massaBridgeContract: 'AS1owaJB7NkqY2pjsggBP7m1jFA9XRZKGpXBbjBMeysQDSxjm7MS',
    lambdaUrl:
      'https://6sul7w7nqer7pd5mf7cl6l2muy0isblj.lambda-url.eu-west-3.on.aws/default/',
    wmas_address: '0x3C53552D3A54672fe1113e2FDDd2099d6E9E585D' as `0x${string}`,
  },
};

export const AVAILABLE_MODES = [BridgeMode.mainnet, BridgeMode.testnet];

// Transaction fees
export const forwardBurnFees = {
  fee: 10_000_000n,
  coins: 0n,
};

export const increaseAllowanceFee = {
  fee: 10_000_000n,
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
