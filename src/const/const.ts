export const MASSA_WALLET = 'Massa Wallet';
export const MASSA_WALLET_PROVIDER = 'massaWalletProvider';
export const MASSA_STATION = 'MASSASTATION';
export const EVM_BRIDGE_ADDRESS = '0xE93C110BF69C8D30b93a3c095372CFC965e50EFa';

// SMART CONTRACTS ADDRESSES
export const CONTRACT_ADDRESS =
  'AS1Q9sUuU9Gq2XotU6ttJWR34gZg7Y2YEBJusG4ncVAnqjLP5zbA';

export const TDAI_CONTRACT_ADDRESS =
  '0x53844F9577C2334e541Aec7Df7174ECe5dF1fCf0';

export const TDAI_MASSA_ADDRESS =
  'AS12wgi5im9UfzNNYEH7WHg1ehnU9TfGgass1CtJom8s1S2E4seTs';

export const WETH_CONTRACT_ADDRESS =
  '0xf6E9FBff1CF908f6ebC1a274f15F5c0985291424';

export const WETH_MASSA_ADDRESS =
  'AS1zyUoko3poaffqTd8kEwCR5L4C7pftdN3mDjEmbcDU4AhmBxHo';

export const QUEST_NAME = 'Bridge';

export const QUEST_CONNECT_WALLET = 'CONNECT_WALLET';

export const QUEST_SERVER = 'https://dashboard.massa.net/quest_validation';

export const U256_MAX = BigInt(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
);

export const NETWORKS = ['mainnet', 'testnet', 'buildnet', 'labnet'];

// Transaction fees
export const forwardBurnFees = {
  fee: 0n,
  coins: 100000n,
  maxGas: 700_000_000n,
};

export const increaseAllowanceFee = {
  fee: 0n,
  coins: 1000n,
  maxGas: 700_000_000n,
};

export const supportedtokens = {
  tDai: 'tDAI',
  WETH: 'WETH',
};

export const massaToken = 'MAS';
