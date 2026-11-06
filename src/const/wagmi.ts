import { bsc, bscTestnet, mainnet, sepolia } from 'viem/chains';
import { createConfig, createStorage, fallback, http } from 'wagmi';
const { VITE_MAINNET_RPC, VITE_SEPOLIA_RPC, VITE_BSC_RPC } = import.meta.env;

// Public endpoints that answer CORS preflights from browser origins.
// Order matters: the first healthy one is used, the next ones only on failure.
const DEFAULT_MAINNET_RPCS = [
  'https://ethereum-rpc.publicnode.com',
  'https://rpc.mevblocker.io',
  'https://1rpc.io/eth',
  'https://eth.drpc.org',
  'https://cloudflare-eth.com',
];
const DEFAULT_SEPOLIA_RPCS = [
  'https://ethereum-sepolia-rpc.publicnode.com',
  'https://1rpc.io/sepolia',
];
const DEFAULT_BSC_RPCS = [
  'https://bsc-rpc.publicnode.com',
  'https://bsc-dataseed.bnbchain.org',
  'https://1rpc.io/bnb',
  'https://bsc.drpc.org',
];
const DEFAULT_BSC_TESTNET_RPCS = [
  'https://bsc-testnet-rpc.publicnode.com',
  'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
];

// Env RPCs (comma-separated) take priority, public defaults stay as backups.
function transport(envRpcs: string | undefined, defaults: string[]) {
  const fromEnv = (envRpcs ?? '')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);
  const urls = [...new Set([...fromEnv, ...defaults])];
  // Retry once per endpoint so a dead one is skipped quickly.
  return fallback(urls.map((url) => http(url, { retryCount: 1 })));
}

export const config = createConfig({
  chains: [mainnet, sepolia, bsc, bscTestnet],
  storage: createStorage({ storage: window.localStorage }),
  transports: {
    [mainnet.id]: transport(VITE_MAINNET_RPC, DEFAULT_MAINNET_RPCS),
    [sepolia.id]: transport(VITE_SEPOLIA_RPC, DEFAULT_SEPOLIA_RPCS),
    [bsc.id]: transport(VITE_BSC_RPC, DEFAULT_BSC_RPCS),
    [bscTestnet.id]: transport(undefined, DEFAULT_BSC_TESTNET_RPCS),
  },
});
