import { useState } from 'react';

import {
  Button,
  Dropdown,
  ThemeMode,
  BridgeLogo,
} from '@massalabs/react-ui-kit';
import { useAccount } from 'wagmi';

import { ConnectWalletPopup } from '@/components';
import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';

export function LayoutBridge({ ...props }) {
  const { onSetTheme, storedTheme, children } = props;

  const { isConnected: isEvmWalletConnected } = useAccount();

  const [accounts] = useAccountStore((state) => [state.accounts]);

  const hasAccounts = accounts?.length > 0;

  const options = [
    {
      item: 'buildnet',
    },
  ];

  const [selectedTheme, setSelectedTheme] = useState(
    storedTheme || 'theme-dark',
  );

  function handleSetTheme(theme: string) {
    setSelectedTheme(theme);

    onSetTheme?.(theme);
  }

  const [open, setOpen] = useState(false);

  const popupArgs = {
    setOpen,
  };

  function ConnectedWallet() {
    return (
      <Button
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
      <Button customClass="h-[54px]" onClick={() => setOpen(true)}>
        {Intl.t('connect-wallet.title')}
      </Button>
    );
  }

  return (
    <div
      className="bg-fixed bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))]
      from-bright-blue to-deep-blue to-60% overflow-auto w-full min-h-screen
      "
    >
      <div className="flex flex-row items-center justify-between px-11 py-8 w-full h-fit fixed z-10 backdrop-blur-sm">
        <BridgeLogo theme={selectedTheme} />
        <div className="flex flex-row items-center gap-4">
          <Dropdown readOnly={true} options={options} />
          {isEvmWalletConnected && hasAccounts ? (
            <ConnectedWallet />
          ) : (
            <NotConnectedWallet />
          )}
          <ThemeMode onSetTheme={handleSetTheme} />
        </div>
      </div>
      <div
        className={`flex flex-col justify-center items-center pt-[150px] pb-10`}
      >
        {children}
      </div>
      {open ? <ConnectWalletPopup {...popupArgs} /> : null}
    </div>
  );
}
