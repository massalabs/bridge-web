import {
  BridgeLogo,
  Button,
  Dropdown,
  ThemeMode,
} from '@massalabs/react-ui-kit';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';

import Intl from '@/i18n/i18n';
import { useAccountStore, useBridgeModeStore } from '@/store/store';
import { capitalize } from '@/utils/utils';

export function Navbar({ ...props }) {
  const { onSetTheme, setSelectedTheme, selectedTheme, setOpen } = props;

  const [currentMode, availableModes, setCurrentMode] = useBridgeModeStore(
    (state) => [state.currentMode, state.availableModes, state.setCurrentMode],
  );

  const [accounts, isFetching, isStationInstalled] = useAccountStore(
    (state) => [state.accounts, state.isFetching, state.isStationInstalled],
  );

  const { isConnected: isEvmWalletConnected } = useAccount();

  const hasAccounts = accounts?.length > 0;
  const showPingAnimation =
    window.ethereum?.isConnected() && isStationInstalled;

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

  function handleSetTheme(theme: string) {
    setSelectedTheme(theme);
    onSetTheme?.(theme);
  }

  return (
    <div
      className="hidden sm:flex flex-row items-center justify-between px-6 
      py-8 w-full fixed z-10 backdrop-blur-sm"
    >
      <div className="flex items-center gap-8 h-fit">
        <BridgeLogo theme={selectedTheme} />
        <p className="mas-menu-default text-neutral h-fit">
          <Link to="/index">Bridge</Link>
        </p>
        {isEvmWalletConnected ? (
          <p className="mas-menu-default text-neutral h-fit">
            <Link to="/claim">Claim</Link>
          </p>
        ) : null}
      </div>
      <div className="flex flex-row items-center gap-4">
        <Dropdown
          options={availableModes.map((m) => ({
            item: capitalize(m),
            onClick: () => setCurrentMode(m),
          }))}
          select={availableModes.indexOf(currentMode)}
        />
        {isEvmWalletConnected && hasAccounts && isStationInstalled ? (
          <ConnectedWallet />
        ) : (
          <NotConnectedWallet />
        )}
        <ThemeMode onSetTheme={handleSetTheme} />
      </div>
    </div>
  );
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
