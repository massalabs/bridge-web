import { useEffect } from 'react';

import {
  RessourceSidePanel,
  ConnectedCard,
  MetamaskNotInstalled,
  CustomConnectButton,
  Connected,
  Disconnected,
} from '@/components';

import { useAccount } from 'wagmi';

import Intl from '@/i18n/i18n';

import { useAccountStore, useNetworkStore } from '@/store/store';
import { MassaConnectError } from './CardVariations/MassaError';
import { providers } from '@massalabs/wallet-provider';
import { MASSA_STATION } from '@/const';

export function ConnectWalletCards() {
  const { isConnected: isEvmWalletConnected } = useAccount();

  const [
    accounts,
    account,
    setAccount,
    isFetching,
    balance,
    isStationInstalled,
    setStationInstalled,
  ] = useAccountStore((state) => [
    state.accounts,
    state.account,
    state.setAccount,
    state.isFetching,
    state.balance,
    state.isStationInstalled,
    state.setStationInstalled,
  ]);

  const [isMetamaskInstalled, setIsMetamaskInstalled] = useNetworkStore(
    (state) => [state.isMetamaskInstalled, state.setIsMetamaskInstalled],
  );

  async function getProviderList() {
    const providerList = await providers();
    const massaStationWallet = providerList.find(
      (provider: any) => provider.name() === MASSA_STATION,
    );
    setStationInstalled(!!massaStationWallet);
  }

  useEffect(() => {
    setIsMetamaskInstalled(window.ethereum?.isConnected());
    getProviderList();
  }, [isMetamaskInstalled, isStationInstalled]);

  const massaWalletArgs = {
    accounts,
    account,
    setAccount,
    isFetching,
    balance,
    isStationInstalled,
  };

  return (
    <div className="pb-10 flex flex-row gap-4 text-f-primary">
      <div className="flex flex-col gap-4 min-w-[65%]">
        <WalletCard>
          <div className="flex justify-between w-full mb-4">
            <p> {Intl.t('connect-wallet.card-destination.from')} </p>
            {isEvmWalletConnected ? <Connected /> : <Disconnected />}
          </div>
          {/* <ConnectEvmButton /> */}
          <div className="w-full">
            {isMetamaskInstalled ? (
              <CustomConnectButton />
            ) : (
              <MetamaskNotInstalled />
            )}
          </div>
        </WalletCard>
        <WalletCard>
          <div className="flex justify-between w-full mb-4">
            <p>{Intl.t('connect-wallet.card-destination.to')}</p>
            {accounts?.length ? <Connected /> : <Disconnected />}
          </div>
          {!isFetching && accounts?.length ? (
            <ConnectedCard {...massaWalletArgs} />
          ) : (
            <MassaConnectError {...massaWalletArgs} />
          )}
        </WalletCard>
      </div>
      <RessourceSidePanel />
    </div>
  );
}

// Wallet card wrapper component

export function WalletCard({ ...props }) {
  const { children } = props;

  return (
    <div
      className="bg-primary max-w-full h-60 p-6 
                    rounded-2xl
                    flex flex-col justify-center items-center"
    >
      <div className="flex flex-col w-full mas-body">{children}</div>
    </div>
  );
}
