import { bsc, bscTestnet, mainnet, sepolia } from 'viem/chains';
import { createConfig, createStorage, http } from 'wagmi';

export const config = createConfig({
  chains: [mainnet, sepolia, bsc, bscTestnet],
  storage: createStorage({ storage: window.localStorage }),
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
});
