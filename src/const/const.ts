export const MASSA_WALLET = 'Massa Wallet';
export const MASSA_WALLET_PROVIDER = 'massaWalletProvider';
export const MASSA_STATION = 'MASSASTATION';
export const EVM_BRIDGE_ADDRESS = '0x141631E69E65c697c142f56c6fdCaF4ec648390e';
export const MASSA = 'Massa';
export const METAMASK = 'Metamask';
// SMART CONTRACTS ADDRESSES
export const CONTRACT_ADDRESS =
  'AS12UwPZ3EdM2sLX37zMdVH46McZohZRDbS4AhrfbfxtajRawD4jr';

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

export const tokenMappings = {
  '0x53844F9577C2334e541Aec7Df7174ECe5dF1fCf0': supportedtokens.tDai,
  '0xf6E9FBff1CF908f6ebC1a274f15F5c0985291424': supportedtokens.WETH,
};

export function getSupportedTokenName(contractAddress: `0x${string}`) {
  for (const [key, value] of Object.entries(tokenMappings)) {
    if (key === contractAddress) {
      return value;
    }
  }
  return null;
}
