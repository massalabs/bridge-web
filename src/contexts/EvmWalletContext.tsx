import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { PropsWithChildren } from 'react';
import { WagmiConfig } from 'wagmi';
import { chains, config } from '@/const/wagmi';

export function EvmWalletContext({ children }: PropsWithChildren<unknown>) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider
        chains={chains}
        theme={lightTheme({
          borderRadius: 'small',
          fontStack: 'system',
        })}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
