export const MASSA_WALLET = 'Massa Wallet';
export const MASSA_WALLET_PROVIDER = 'massaWalletProvider';
export const MASSA_STATION = 'MASSASTATION';
export const MASSA = 'Massa';
export const ETHEREUM = 'Ethereum';
export const METAMASK = 'Metamask';
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
      '0x141631E69E65c697c142f56c6fdCaF4ec648390e' as `0x${string}`,
    massaBridgeContract:
      'AS12UwPZ3EdM2sLX37zMdVH46McZohZRDbS4AhrfbfxtajRawD4jr',
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

export const supportedtokens = {
  tDai: 'tDAI',
  WETH: 'WETH',
};

export const massaToken = 'MAS';

export enum SUPPORTED_MASSA_WALLETS {
  MASSASTATION = 'MASSASTATION',
  BEARBY = 'BEARBY',
}
