import { useState } from 'react';

import {
  Button,
  Dropdown,
  ThemeMode,
  BridgeLogo,
} from '@massalabs/react-ui-kit';
import { useAccount } from 'wagmi';

import { ConnectWalletPopup, Footer } from '@/components';
import { TopBanner } from '@/components/TopBanner/TopBanner';
import { NETWORKS } from '@/const';
import Intl from '@/i18n/i18n';
import { useAccountStore, useNetworkStore } from '@/store/store';
import { capitalize } from '@/utils/utils';

export function LayoutBridge({ ...props }) {
  const { onSetTheme, storedTheme, children } = props;

  const [currentNetwork] = useNetworkStore((state) => [state.currentNetwork]);
  const [isMetamaskInstalled] = useNetworkStore((state) => [
    state.isMetamaskInstalled,
  ]);
  const options = NETWORKS.map((n) => {
    return { item: capitalize(n) };
  });
  const { isConnected: isEvmWalletConnected } = useAccount();
  const [accounts, isFetching, isStationInstalled] = useAccountStore(
    (state) => [state.accounts, state.isFetching, state.isStationInstalled],
  );
  const hasAccounts = accounts?.length > 0;
  const showPingAnimation = isMetamaskInstalled && isStationInstalled;

  const [selectedTheme, setSelectedTheme] = useState(
    storedTheme || 'theme-dark',
  );
  const [open, setOpen] = useState(false);

  function handleSetTheme(theme: string) {
    setSelectedTheme(theme);
    onSetTheme?.(theme);
  }

  function PingAnimation() {
    return (
      <span className="absolute flex h-3 w-3 top-0 right-0 -mr-1 -mt-1">
        <span
          className="animate-ping absolute inline-flex h-full w-full
              rounded-full bg-s-error opacity-75 "
        ></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-s-error"></span>
      </span>
    );
  }

  function ConnectedWallet() {
    return (
      <Button
        disabled={isFetching}
        variant="secondary"
        customClass="h-[54px]"
        onClick={() => setOpen(true)}
      >
        {Intl.t('connect-wallet.connected')}
      </Button>
    );
  }

  function NotConnectedWallet() {
    return (
      <>
        <Button
          disabled={isFetching}
          customClass="h-[54px] relative"
          onClick={() => setOpen(true)}
        >
          {Intl.t('connect-wallet.title')}
          {showPingAnimation && <PingAnimation />}
        </Button>
      </>
    );
  }

  return (
    <div
      className="bg-fixed bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))]
      from-bright-blue to-deep-blue to-60% overflow-auto w-full min-h-screen
      "
    >
      <div
        className="hidden sm:flex flex-row items-center justify-between px-11 
      py-8 w-full h-fit fixed z-10 backdrop-blur-sm"
      >
        <BridgeLogo theme={selectedTheme} />
        <div className="flex flex-row items-center gap-4">
          <Dropdown
            readOnly={true}
            options={options}
            select={NETWORKS.indexOf(currentNetwork ?? '')}
          />
          {isEvmWalletConnected && hasAccounts && isStationInstalled ? (
            <ConnectedWallet />
          ) : (
            <NotConnectedWallet />
          )}
          <ThemeMode onSetTheme={handleSetTheme} />
        </div>
      </div>
      <div className="hidden sm:flex flex-col justify-center items-center pt-[150px] pb-10">
        <TopBanner />
        {children}
      </div>
      {open && <ConnectWalletPopup setOpen={setOpen} />}
      <div className="hidden sm:block">
        <Footer selectedTheme={selectedTheme} />
      </div>

      {/* display only on mobile*/}
      <div className="sm:hidden h-screen flex items-center justify-center">
        <div className="flex flex-col w-full gap-10 p-4">
          <BridgeLogo theme={selectedTheme} />
          <p className="mas-banner text-6xl text-f-primary mb-6">
            {Intl.t('desktop.title')}
          </p>
        </div>
      </div>
    </div>
  );
}
