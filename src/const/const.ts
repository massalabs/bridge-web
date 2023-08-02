export const MASSA_WALLET = 'Massa Wallet';
export const MASSA_WALLET_PROVIDER = 'massaWalletProvider';
export const MASSA_STATION = 'MASSASTATION';
export const EVM_BRIDGE_ADDRESS = '0x5E207520c805dC98f55D9A94701a3d20c10A9e31';

// SMART CONTRACTS ADDRESSES
export const CONTRACT_ADDRESS =
  'AS12WGUtSchzq3eozUBryMixkDfkHZtFvavh8LeBYxP6LmhtLgy7U';
export const TDAI_CONTRACT_ADDRESS =
  '0x53844F9577C2334e541Aec7Df7174ECe5dF1fCf0';
export const WETH_CONTRACT_ADDRESS =
  '0xf6E9FBff1CF908f6ebC1a274f15F5c0985291424';

export const U256_MAX = BigInt(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
);

// Transaction fees
export const forwardBurnFees = {
  fee: 0n,
  coins: 100000n,
  maxGas: 1000000n,
};

export const increaseAllowanceFee = {
  fee: 0n,
  coins: 1000n,
  maxGas: 1000000n,
};
