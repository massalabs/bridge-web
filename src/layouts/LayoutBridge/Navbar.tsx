import { Button, Dropdown, Theme, ThemeMode } from '@massalabs/react-ui-kit';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';

import { BridgeLogo } from '@/assets/BridgeLogo';
import { Banner } from '@/components';
import { Tos } from '@/components/Tos';
import { Blockchain, PAGES } from '@/const';
import { useConnectedEvmChain } from '@/custom/bridge/useConnectedEvmChain';
import {
  useEvmChainValidation,
  useGetChainValidationContext,
  useMassaNetworkValidation,
} from '@/custom/bridge/useNetworkValidation';
import { useWrongNetworkToast } from '@/custom/bridge/useWrongNetworkToast';
import Intl from '@/i18n/i18n';
import { BRIDGE_THEME_STORAGE_KEY } from '@/store/configStore';
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
  const currentEvmChain = useConnectedEvmChain();
  const { setTheme } = useConfigStore();
  const { context } = useGetChainValidationContext();
  const isValidEvmNetwork = useEvmChainValidation(context);
  const isValidMassaNetwork = useMassaNetworkValidation();

  const { isConnected: isConnectedEVM } = useAccount();

  const hasAccounts = (accounts || []).length > 0;
  const showPingAnimation =
    !isConnectedEVM ||
    !isValidEvmNetwork ||
    !isValidMassaNetwork ||
    !connectedAccount;

  // Responsible for trigger wrong network toast across Dapp
  useWrongNetworkToast();

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

  function handleSetTheme(newTheme: Theme) {
    setTheme(newTheme);
  }

  const areBothWalletsConnected = isConnectedEVM && connectedAccount;

  return (
    <div className="hidden sm:flex flex-col z-10 w-full">
      <div
        className="flex flex-row items-center justify-between px-6 
        py-8 w-full"
      >
        <div className="flex items-center gap-8 h-fit">
          <Link to={`/${PAGES.INDEX}`}>
            <BridgeLogo />
          </Link>
          <p className="mas-menu-default text-neutral h-fit">
            <Link to={`/${PAGES.INDEX}`}>{Intl.t('navbar.bridge')}</Link>
          </p>
          {isConnectedEVM ? (
            <p className="mas-menu-default text-neutral h-fit">
              <Link to={`/${PAGES.CLAIM}`}>{Intl.t('navbar.claim')}</Link>
            </p>
          ) : null}
          <p className="mas-menu-default text-brand h-fit">
            <Link to={`/${PAGES.DAO}`}>{Intl.t('navbar.dao-maker')}</Link>
          </p>
          {areBothWalletsConnected ? (
            <p className="mas-menu-default text-neutral h-fit">
              <Link to={`/${PAGES.HISTORY}`}>{Intl.t('navbar.history')}</Link>
            </p>
          ) : null}
          <p className="mas-menu-default text-neutral h-fit">
            <Link to={`/${PAGES.FAQ}`}>{Intl.t('navbar.faq')}</Link>
          </p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <Dropdown
            options={availableModes.map((m) => ({
              item: capitalize(m),
              onClick: () => setCurrentMode(m),
            }))}
            select={availableModes.indexOf(currentMode)}
          />
          {isConnectedEVM && hasAccounts && connectedAccount ? (
            <ConnectedWallet />
          ) : (
            <NotConnectedWallet />
          )}
          <ThemeMode
            onSetTheme={handleSetTheme}
            storageKey={BRIDGE_THEME_STORAGE_KEY}
          />
        </div>
      </div>
      <Tos />
      {currentEvmChain === Blockchain.BSC && (
        <Banner>
          {Intl.t('dao-maker.dao-bridge-redeem-warning')}{' '}
          <Link to={`/${PAGES.DAO}`}>
            <u>{Intl.t('dao-maker.page-name')} </u>
          </Link>
        </Banner>
      )}
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
