import { useEffect } from 'react';

import { IAccountBalanceResponse, IAccount } from '@massalabs/wallet-provider';
import { useAccount } from 'wagmi';

import { MassaConnectError } from './CardVariations/MassaError';
import {
  RessourceSidePanel,
  ConnectedCard,
  MetamaskNotInstalled,
  CustomConnectButton,
  Connected,
  Disconnected,
} from '@/components';
import Intl from '@/i18n/i18n';
import { useAccountStore, useNetworkStore } from '@/store/store';

export type MassaWalletArgs = {
  accounts: IAccount[];
  connectedAccount: IAccount | null;
  setConnectedAccount: (account?: IAccount) => void;
  isFetching: boolean;
  balance: IAccountBalanceResponse;
  isStationInstalled: boolean;
};

export function ConnectWalletCards() {
  const { isConnected } = useAccount();

  const [
    accounts,
    connectedAccount,
    setConnectedAccount,
    isFetching,
    balance,
    isStationInstalled,
  ] = useAccountStore((state) => [
    state.accounts,
    state.connectedAccount,
    state.setConnectedAccount,
    state.isFetching,
    state.balance,
    state.isStationInstalled,
  ]);

  const [isMetamaskInstalled, setIsMetamaskInstalled] = useNetworkStore(
    (state) => [state.isMetamaskInstalled, state.setIsMetamaskInstalled],
  );

  useEffect(() => {
    setIsMetamaskInstalled(window.ethereum?.isConnected());
  }, [isMetamaskInstalled]);

  const massaWalletArgs: MassaWalletArgs = {
    accounts,
    connectedAccount,
    setConnectedAccount,
    isFetching,
    balance,
    isStationInstalled,
  };

  const bothNotConnected =
    !isConnected || !isStationInstalled || accounts.length === 0;

  const gridColsTemplate = bothNotConnected ? 'grid-cols-3' : 'grid-cols-2';

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
        <WalletCard>
          <div className="flex justify-between items-center mb-4">
            <p className="mas-body">
              {Intl.t('connect-wallet.card-destination.to')}
            </p>
            {accounts.length ? <Connected /> : <Disconnected />}
          </div>
          {accounts.length ? (
            <ConnectedCard {...massaWalletArgs} />
          ) : (
            <MassaConnectError {...massaWalletArgs} />
          )}
        </WalletCard>
      </div>
      {bothNotConnected && (
        <div className="row-span-2 col-start-3 row-start-1">
          <RessourceSidePanel />
        </div>
      )}
    </div>
  );
}

// Wallet card wrapper component

export function WalletCard({ ...props }) {
  const { children } = props;

  return (
    <div className="bg-primary h-60 p-6 rounded-2xl flex flex-col justify-center items-center">
      <div className="flex flex-col w-full mas-body">{children}</div>
    </div>
  );
}
