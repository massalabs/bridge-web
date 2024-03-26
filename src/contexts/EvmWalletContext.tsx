import '@rainbow-me/rainbowkit/styles.css';
import { PropsWithChildren } from 'react';
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { config } from '../const/wagmi';
import { useConfigStore } from '@/store/store';

export function EvmWalletContext({ children }: PropsWithChildren<unknown>) {
  const { theme } = useConfigStore();
  const rainbowkitTheme = theme === 'theme-dark' ? darkTheme : lightTheme;

  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider
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
