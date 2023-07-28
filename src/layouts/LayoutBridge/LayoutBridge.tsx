import { useEffect, useState } from 'react';

import {
  Button,
  Dropdown,
  ThemeMode,
  BridgeLogo,
} from '@massalabs/react-ui-kit';

import { ConnectWalletPopup } from '@/components/ConnectWalletPopup/ConnectWalletPopup';
import { useAccount } from 'wagmi';
import { useAccountStore } from '@/store/store';
import { FiCheck } from 'react-icons/fi';

export function LayoutBridge({ ...props }) {
  const { onSetTheme, storedTheme, children } = props;

  const { isConnected: isEvmWalletConnected } = useAccount();

  const [accounts, isStationInstalled] = useAccountStore((state) => [
    state.accounts,
    state.isStationInstalled,
  ]);

  const [bridgeConnected, setBridgeConnected] = useState(false);

  useEffect(() => {
    if (accounts?.length > 0 && isStationInstalled && isEvmWalletConnected) {
      setBridgeConnected(true);
    }
  }, [accounts, isStationInstalled, isEvmWalletConnected]);

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

  return (
    <div
      className="bg-fixed bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))]
      from-bright-blue to-deep-blue to-60% overflow-auto w-full min-h-screen
      "
    >
      {/* Header Element */}
      <div className="flex flex-row items-center justify-between px-11 py-8 w-full h-fit fixed z-10 backdrop-blur-sm">
        <BridgeLogo theme={selectedTheme} />
        <div className="flex flex-row items-center gap-4">
          <Dropdown readOnly={true} options={options} />
          {bridgeConnected ? (
            <Button
              customClass="h-[54px]"
              posIcon={bridgeConnected ? <FiCheck /> : null}
              onClick={() => setOpen(true)}
            >
              Connected
            </Button>
          ) : (
            <Button customClass="h-[54px]" onClick={() => setOpen(true)}>
              Connect Wallets
            </Button>
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
