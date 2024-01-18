import { useAccount } from 'wagmi';

import EvmConnectButton from './EvmConnectButton';
import { MetamaskNotInstalled } from './MetamaskNotInstalled';
import { Connected, Disconnected } from '@/components';
import Intl from '@/i18n/i18n';

const ConnectEvmWallet = () => {
  const { isConnected } = useAccount();
  const isMetamaskInstalled = window.ethereum?.isConnected();

  return (
    <>
      <div className="flex gap-2 items-center mb-4">
        <p className="mas-body">
          {Intl.t('connect-wallet.card-destination.from')}
        </p>
        {isConnected ? <Connected /> : <Disconnected />}
      </div>
      <div className="w-full">
        {isMetamaskInstalled ? <EvmConnectButton /> : <MetamaskNotInstalled />}
      </div>
    </>
  );
};

export default ConnectEvmWallet;
