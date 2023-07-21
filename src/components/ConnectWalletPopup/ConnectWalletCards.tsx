import { useEffect, useState } from 'react';

import {
  RessourceSidePanel,
  ConnectedCard,
  MetamaskNotInstalled,
  CustomConnectButton,
} from '@/components';

import { useAccount } from 'wagmi';

import Intl from '@/i18n/i18n';

import { useAccountStore } from '@/store/store';
import { Connected, Disconnected } from '@/pages';
import { MassaConnectError } from './CardVariations/MassaConnectError';

export function ConnectWalletCards() {
  const { isConnected: isEvmWalletConnected } = useAccount();

  const [accounts, account, setAccount] = useAccountStore((state) => [
    state.accounts,
    state.account,
    state.setAccount,
  ]);

  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState<boolean>(
    window.ethereum.isConnected(),
  );

  useEffect(() => {
    setIsMetamaskInstalled(window.ethereum.isConnected());
  }, [isMetamaskInstalled]);

  const massaWalletArgs = {
    accounts,
    account,
    setAccount,
  };

  return (
    <div className="pb-10 flex flex-row gap-4 text-f-primary">
      <div className="flex flex-col gap-4 min-w-[480px]">
        <WalletCard>
          <div className="flex justify-between w-full mb-4">
            <p> {Intl.t('connect-wallet.card-destination.from')} </p>
            {isEvmWalletConnected ? <Connected /> : <Disconnected />}
          </div>
          {/* <ConnectEvmButton /> */}
          {isMetamaskInstalled ? (
            <CustomConnectButton />
          ) : (
            <MetamaskNotInstalled />
          )}
        </WalletCard>
        <WalletCard>
          <div className="flex justify-between w-full mb-4">
            <p>{Intl.t('connect-wallet.card-destination.to')}</p>
            {accounts?.length ? <Connected /> : <Disconnected />}
          </div>
          {/*  Add user flow cases where there is no massastation, no wallet etc etc */}
          {accounts?.length ? (
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
      className="bg-primary w-full h-60 p-6 
                    rounded-2xl
                    flex flex-col justify-center items-center"
    >
      <div className="flex flex-col w-full mas-body">{children}</div>
    </div>
  );
}
