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
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();
  const rainbowkitTheme = theme === 'theme-dark' ? darkTheme : lightTheme;

  // From a UX perspective it's not great to have the initialchain set to sepolia or eth
  // now that we have a bsc support... but since it's temp we can leave it like this
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
