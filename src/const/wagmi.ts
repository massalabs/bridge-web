import { bsc, bscTestnet, mainnet, sepolia } from 'viem/chains';
import { createConfig, createStorage, http } from 'wagmi';

export const config = createConfig({
  chains: [mainnet, sepolia, bsc, bscTestnet],
  storage: createStorage({ storage: window.localStorage }),
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http('https://rpc2.sepolia.org'),
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
});
