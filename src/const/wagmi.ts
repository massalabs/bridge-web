import { bsc, bscTestnet, mainnet, sepolia } from 'viem/chains';
import { createConfig, createStorage, http } from 'wagmi';
const { VITE_MAINNET_RPC, VITE_SEPOLIA_RPC, VITE_BSC_RPC } = import.meta.env;

const DEFAULT_MAINNET_RPC = 'https://eth.llamarpc.com';
const DEFAULT_SEPOLIA_RPC = 'https://ethereum-sepolia-rpc.publicnode.com';
const DEFAULT_BSC_RPC = 'https://bsc.drpc.org';

export const config = createConfig({
  chains: [mainnet, sepolia, bsc, bscTestnet],
  storage: createStorage({ storage: window.localStorage }),
  transports: {
    [mainnet.id]: http(VITE_MAINNET_RPC ?? DEFAULT_MAINNET_RPC),
    [sepolia.id]: http(VITE_SEPOLIA_RPC ?? DEFAULT_SEPOLIA_RPC),
    [bsc.id]: http(VITE_BSC_RPC ?? DEFAULT_BSC_RPC),
    [bscTestnet.id]: http(),
  },
});
