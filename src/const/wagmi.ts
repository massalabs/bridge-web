import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
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

const projectId = 'massa-bridge';
export const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({
        projectId,
        chains,
      }),
      injectedWallet({ chains }),
      rainbowWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
