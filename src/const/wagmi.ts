import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, sepolia } from 'wagmi';
import { publicProvider } from '@wagmi/core/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';

import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';

const ALCHEMY_API_KEY = import.meta.env['VITE_ALCHEMY_API_KEY'] || '';
export const { chains, publicClient } = configureChains(
  [sepolia],
  [
    // TODO Put massa Alchemy API key here
    alchemyProvider({ apiKey: ALCHEMY_API_KEY }),
    publicProvider(),
  ],
);
// -chxUrqdCqZWteAu27xRbxHzdnMt2VjW
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
