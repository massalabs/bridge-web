import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import EvmConnectButton from './EvmConnectButton';
import { MetamaskNotInstalled } from './MetamaskNotInstalled';
import { useBridgeModeStore } from '../../../store/store';
import { validateEvmNetwork } from '../../../utils/network';
import { Connected, Disconnected, WrongChain } from '@/components';
import Intl from '@/i18n/i18n';

const ConnectEvmWallet = () => {
  const { chain } = useNetwork();
  const { isMainnet } = useBridgeModeStore();

  const { isConnected } = useAccount();
  const isMetamaskInstalled = window.ethereum?.isConnected();

  const [wrongNetwork, setWrongNetwork] = useState<boolean>(false);
  useEffect(() => {
    setWrongNetwork(!validateEvmNetwork(isMainnet, chain?.id));
  }, [isMainnet, chain]);

  return (
    <>
      <div className="flex gap-2 items-center mb-4">
        <p className="mas-body">
          {Intl.t('connect-wallet.card-destination.from')}
        </p>
        {isConnected ? (
          wrongNetwork ? (
            <WrongChain />
          ) : (
            <Connected />
          )
        ) : (
          <Disconnected />
        )}
      </div>
      <div className="w-full">
        {isMetamaskInstalled ? <EvmConnectButton /> : <MetamaskNotInstalled />}
      </div>
    </>
  );
};

export default ConnectEvmWallet;
