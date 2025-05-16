import { bsc, bscTestnet, mainnet, sepolia } from 'viem/chains';
import { createConfig, createStorage, http } from 'wagmi';
const { VITE_MAINNET_RPC, VITE_BSC_RPC } = import.meta.env;

export const config = createConfig({
  chains: [mainnet, sepolia, bsc, bscTestnet],
  storage: createStorage({ storage: window.localStorage }),
  transports: {
    [mainnet.id]: http(VITE_MAINNET_RPC ?? mainnet.rpcUrls.default.http[0]),
    [sepolia.id]: http('https://sepolia.drpc.org'),
    [bsc.id]: http(VITE_BSC_RPC ?? bsc.rpcUrls.default.http[0]),
    [bscTestnet.id]: http(),
  },
});
