import { mainnet, sepolia } from 'viem/chains';
import { createConfig, createStorage, http } from 'wagmi';

export const config = createConfig({
  chains: [mainnet, sepolia],
  storage: createStorage({ storage: window.localStorage }),
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
