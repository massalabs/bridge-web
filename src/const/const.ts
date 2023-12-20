export const MASSA_WALLET = 'Massa Wallet';
export const MASSA_WALLET_PROVIDER = 'massaWalletProvider';
export const MASSA_STATION = 'MASSASTATION';
export const EVM_BRIDGE_ADDRESS = '0x86506DEb22c0285a0D9a5a770177176343a3E3bd';

// SMART CONTRACTS ADDRESSES
export const CONTRACT_ADDRESS =
  'AS1eY3uaFi19RZ6yzhPUQSWyJAJCGH2GNzZKruSTotRzXV6ZKJQg';

export const TDAI_CONTRACT_ADDRESS =
  '0x53844F9577C2334e541Aec7Df7174ECe5dF1fCf0';

export const TDAI_MASSA_ADDRESS =
  'AS187bzqFt9iscTvHZi34uU1u162DnNaxqffWq3HYGQ9jiHz4ukv';

export const WETH_CONTRACT_ADDRESS =
  '0xf6E9FBff1CF908f6ebC1a274f15F5c0985291424';

export const WETH_MASSA_ADDRESS =
  'AS1koirPmNwhAhJmfMb91Lb7xhB5sv5jLb7YKtsuRnWpVhzg5Kts';

export const U256_MAX = BigInt(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
);

export const NETWORKS = ['mainnet', 'testnet', 'buildnet', 'labnet'];

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
