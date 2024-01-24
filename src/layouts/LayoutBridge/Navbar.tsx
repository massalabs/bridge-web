import { Button, Dropdown, Theme, ThemeMode } from '@massalabs/react-ui-kit';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';

import { BridgeLogo } from '@/assets/BridgeLogo';
import { Banner } from '@/components';
import { useWrongNetwork } from '@/custom/bridge/useWrongNetwork';
import Intl from '@/i18n/i18n';
import {
  useAccountStore,
  useBridgeModeStore,
  useConfigStore,
} from '@/store/store';
import { capitalize } from '@/utils/utils';

interface NavbarProps {
  setOpen: (state: boolean) => void;
}

export function Navbar(props: NavbarProps) {
  const { setOpen } = props;

  const { currentMode, availableModes, setCurrentMode } = useBridgeModeStore();
  const { accounts, isFetching, connectedAccount } = useAccountStore();
  const { setTheme } = useConfigStore();
  const { wrongNetwork } = useWrongNetwork();

  const { isConnected: isEvmWalletConnected } = useAccount();

  const hasAccounts = accounts?.length > 0;
  const showPingAnimation =
    (window.ethereum?.isConnected() && !!connectedAccount) || wrongNetwork;

  function ConnectedWallet() {
    return (
      <Button
        disabled={isFetching}
        variant="secondary"
        customClass="h-[54px] relative"
        onClick={() => setOpen(true)}
      >
        {Intl.t('connect-wallet.connected')}
        {showPingAnimation && <PingAnimation />}
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

  function handleSetTheme(theme: Theme) {
    let toggledTheme = theme === 'theme-dark' ? 'theme-light' : 'theme-dark';
    setTheme(toggledTheme);
  }

  return (
    <div className="hidden sm:flex flex-col z-10 w-full">
      <div
        className="flex flex-row items-center justify-between px-6 
      py-8 w-full"
      >
        <div className="flex items-center gap-8 h-fit">
          <BridgeLogo />
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
          {isEvmWalletConnected && hasAccounts && connectedAccount ? (
            <ConnectedWallet />
          ) : (
            <NotConnectedWallet />
          )}
          <ThemeMode onSetTheme={handleSetTheme} />
        </div>
      </div>
      <Banner textToDisplay={Intl.t('index.top-banner.mainnet-coming-soon')} />
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
