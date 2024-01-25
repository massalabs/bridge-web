import { useAccount } from 'wagmi';
import EvmConnectButton from './EvmConnectButton';
import { MetamaskNotInstalled } from './MetamaskNotInstalled';
import { Connected, Disconnected, WrongChain } from '@/components';
import { useWrongNetwork } from '@/custom/bridge/useWrongNetwork';
import Intl from '@/i18n/i18n';

const ConnectEvmWallet = () => {
  const { isConnected } = useAccount();
  const isMetamaskInstalled = window.ethereum?.isConnected();
  const { wrongNetwork } = useWrongNetwork();

  return (
    <>
      <div className="flex gap-2 items-center mb-4">
        <p className="mas-body">
          {isConnected
            ? 'Metamask'
            : Intl.t('connect-wallet.card-destination.from')}
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
