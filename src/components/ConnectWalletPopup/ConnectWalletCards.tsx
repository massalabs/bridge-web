import { useEffect } from 'react';

import { useBearby } from '@hicaru/bearby-react';
import { Dropdown, MassaLogo, Tooltip } from '@massalabs/react-ui-kit';
import { FiChevronLeft } from 'react-icons/fi';
import { useAccount } from 'wagmi';

import { MassaConnectError } from './CardVariations/MassaError';
import { NoWallet } from '../Status/NoWallet/NoWallet';
import { BearbySvg } from '@/assets/BearbySvg';
import {
  RessourceSidePanel,
  ConnectedCard,
  MetamaskNotInstalled,
  CustomConnectButton,
  Connected,
  Disconnected,
  NoAccounts,
} from '@/components';
import Intl from '@/i18n/i18n';
import {
  useAccountStore,
  useNetworkStore,
  useWalletStore,
} from '@/store/store';

export function ConnectWalletCards() {
  const { isConnected } = useAccount();

  const [accounts, isStationInstalled] = useAccountStore((state) => [
    state.accounts,
    state.isStationInstalled,
  ]);

  const [isMetamaskInstalled, setIsMetamaskInstalled] = useNetworkStore(
    (state) => [state.isMetamaskInstalled, state.setIsMetamaskInstalled],
  );

  useEffect(() => {
    setIsMetamaskInstalled(window.ethereum?.isConnected());
  }, [isMetamaskInstalled]);

  const bothNotConnected = !isConnected && !isStationInstalled;
  const isOnlyMetamaskConnected = isConnected && !isStationInstalled;
  const isOnlyMassaConnectedWithAccounts =
    !isConnected && isStationInstalled && accounts.length > 0;
  const hasNoAccounts = accounts?.length <= 0;

  const [currentWallet, isMassaWallet] = useWalletStore((state) => [
    state.currentWallet,
    state.isMassaWallet,
  ]);

  const gridColsTemplate = bothNotConnected ? 'grid-cols-3' : 'grid-cols-2';

  function displayStatus() {
    if (!isStationInstalled) return <Disconnected />;
    else if (hasNoAccounts) return <NoAccounts />;
    return <Connected />;
  }

  return (
    <div
      className={`pb-10 text-f-primary grid ${gridColsTemplate} grid-rows-2 gap-4`}
    >
      <div className="col-span-2">
        <WalletCard>
          <div className="flex justify-between items-center mb-4">
            <p className="mas-body">
              {Intl.t('connect-wallet.card-destination.from')}
            </p>
            {isConnected ? <Connected /> : <Disconnected />}
          </div>
          <div className="w-full">
            {isMetamaskInstalled ? (
              <CustomConnectButton />
            ) : (
              <MetamaskNotInstalled />
            )}
          </div>
        </WalletCard>
      </div>
      <div className="col-span-2 col-start-1 row-start-2">
        {!currentWallet ? (
          <AvailableWallets />
        ) : isMassaWallet ? (
          <MassaWallet
            {...{ isStationInstalled, hasNoAccounts, displayStatus }}
          />
        ) : (
          <NonMassaWallet />
        )}
      </div>
      {(bothNotConnected ||
        isOnlyMetamaskConnected ||
        isOnlyMassaConnectedWithAccounts) && (
        <div className="row-span-2 col-start-3 row-start-1">
          <RessourceSidePanel />
        </div>
      )}
    </div>
  );
}

export function MassaWallet({ ...props }) {
  const { isStationInstalled, hasNoAccounts, displayStatus } = props;

  return (
    <WalletCard>
      <SwitchWallet />
      <div className="flex justify-between items-center mb-4">
        <p className="mas-body">
          {Intl.t('connect-wallet.card-destination.to')}
        </p>
        {displayStatus()}
      </div>
      {!isStationInstalled || hasNoAccounts ? (
        <MassaConnectError />
      ) : (
        <ConnectedCard />
      )}
    </WalletCard>
  );
}

export function NonMassaWallet() {
  const {
    connected: bearbyConnected,
    base58: walletAddress,
    net,
  } = useBearby();

  function displayStatus() {
    if (!bearbyConnected || !net) return <Disconnected />;
    return <Connected />;
  }

  return (
    <WalletCard>
      <SwitchWallet />
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="mas-body">
            {Intl.t('connect-wallet.card-destination.to')}
          </div>
          <Tooltip
            customClass="mas-caption w-fit whitespace-nowrap"
            content={Intl.t('connect-wallet.card-destination.non-massa-wallet')}
          />
        </div>
        {displayStatus()}
      </div>
      {!walletAddress || !bearbyConnected ? (
        Intl.t('connect-wallet.station-connect-error.error-station')
      ) : (
        <ConnectedCard />
      )}
    </WalletCard>
  );
}

export function AvailableWallets() {
  interface WalletIcon {
    [key: string]: JSX.Element;
  }

  const iconsWallets: WalletIcon = {
    MASSASTATION: <MassaLogo size={32} />,
    BEARBY: <BearbySvg />,
  };

  const { connected: bearbyConnected, base58: walletAddress } = useBearby();

  const [wallets, setCurrentWallet] = useWalletStore((state) => [
    state.wallets,
    state.setCurrentWallet,
  ]);

  const hasNoBearby = !bearbyConnected || Boolean(walletAddress);
  const hasNoWallets = wallets?.length === 0 && hasNoBearby;

  const walletOptions = hasNoWallets
    ? [{ item: Intl.t('connect-wallet.card-destination.no-walets') }]
    : wallets.map((wallet) => {
        return {
          item: wallet,
          icon: iconsWallets[wallet.toUpperCase()],
          onClick: () => setCurrentWallet(wallet),
        };
      });

  return (
    <WalletCard>
      <div className="flex justify-between items-center mb-4">
        <p className="mas-body pt-3">
          {Intl.t('connect-wallet.card-destination.select-wallet')}
        </p>
        {hasNoWallets ? <NoWallet /> : null}
      </div>
      <div className="w-full">
        <Dropdown
          readOnly={hasNoWallets}
          select={hasNoWallets ? 0 : -1}
          options={walletOptions}
        />
      </div>
    </WalletCard>
  );
}

export function SwitchWallet() {
  const [currentWallet, setCurrentWallet] = useWalletStore((state) => [
    state.currentWallet,
    state.setCurrentWallet,
  ]);
  const [getAccounts, setConnectedAccount] = useAccountStore((state) => [
    state.getAccounts,
    state.setConnectedAccount,
  ]);

  useEffect(() => {
    getAccounts();
  }, [currentWallet]);

  function resetAccountAndWallet() {
    setCurrentWallet(null);
    setConnectedAccount(undefined);
  }

  return (
    <div
      onClick={resetAccountAndWallet}
      className="flex flex-row just items-center hover:cursor-pointer mb-7 gap-2 w-fit"
    >
      <FiChevronLeft />
      <p>{Intl.t('connect-wallet.card-destination.switch')}</p>
    </div>
  );
}

export function WalletCard({ ...props }) {
  const { children } = props;

  return (
    <div className="bg-deep-blue h-60 p-6 rounded-2xl flex flex-col justify-center items-center">
      <div className="flex flex-col w-full mas-body">{children}</div>
    </div>
  );
}
