import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, sepolia } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import {
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

export const { chains, publicClient } = configureChains(
  [sepolia],
  [publicProvider()],
);

export const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({
        projectId: '',
        chains: chains,
      }),
      // walletConnectWallet({
      //   projectId: '18e0ad18e2d6baa27759d7c94ebdede0',
      //   chains: chains,
      // }),
    ],
  },
]);

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
