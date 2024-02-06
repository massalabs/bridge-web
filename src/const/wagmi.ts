import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import { publicProvider } from '@wagmi/core/providers/public';
import { configureChains, createConfig, sepolia, mainnet } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';

export const { chains, publicClient } = configureChains(
  [sepolia, mainnet],
  [
    publicProvider(),
    infuraProvider({ apiKey: import.meta.env['VITE_INFURA_API_KEY'] }),
    alchemyProvider({ apiKey: import.meta.env['VITE_ALCHEMY_API_KEY'] }),
  ],
  { batch: { multicall: true }, retryCount: 50 },
);

export const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({
        projectId: 'massa-bridge',
        chains: chains,
      }),
    ],
  },
]);

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
