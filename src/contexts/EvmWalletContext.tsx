import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { PropsWithChildren } from 'react';
import { WagmiConfig } from 'wagmi';
import { chains, config } from '@/const/wagmi';
import { useConfigStore } from '@/store/store';

export function EvmWalletContext({ children }: PropsWithChildren<unknown>) {
  const [theme] = useConfigStore((state) => [state.theme]);
  const rainbowkitTheme = theme === 'theme-dark' ? darkTheme : lightTheme;
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider
        chains={chains}
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
    </WagmiConfig>
  );
}
