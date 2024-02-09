import '@rainbow-me/rainbowkit/styles.css';
import { PropsWithChildren } from 'react';
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { sepolia, mainnet } from 'viem/chains';
import { WagmiProvider } from 'wagmi';
import { config } from '../const/wagmi';
import { useBridgeModeStore, useConfigStore } from '@/store/store';

export function EvmWalletContext({ children }: PropsWithChildren<unknown>) {
  const { theme } = useConfigStore();
  const { isMainnet } = useBridgeModeStore();
  const rainbowkitTheme = theme === 'theme-dark' ? darkTheme : lightTheme;

  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider
        initialChain={isMainnet ? mainnet : sepolia}
        theme={rainbowkitTheme({
          accentColor: '#3271A5',
          accentColorForeground: 'white',
          borderRadius: 'medium',
          fontStack: 'system',
          overlayBlur: 'small',
        })}
      >
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
