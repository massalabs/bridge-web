import { useAccount } from 'wagmi';
import EvmConnectButton from './EvmConnectButton';
import { MetamaskNotInstalled } from './MetamaskNotInstalled';
import { ChainStatus } from '@/components/Status/ChainStatus';
import { Blockchain } from '@/const';
import Intl from '@/i18n/i18n';

const ConnectEvmWallet = () => {
  const { isConnected, connector } = useAccount();

  // TODO: refacto so this logic is contained in a utils file
  const connectorName =
    connector?.name || Intl.t(`general.${Blockchain.UNKNOWN}`);

  // This is not necessary if we decide to adopt multiwallet support
  const isMetamaskInstalled = window.ethereum?.isMetaMask;

  // TODO: add toast when bnb chains is connected

  return (
    <>
      <div className="flex gap-2 items-center mb-4">
        <p className="mas-body">
          {isConnected
            ? connectorName
            : Intl.t('connect-wallet.card-destination.from')}
        </p>
        <ChainStatus blockchain={Blockchain.ETHEREUM} />
      </div>
      <div className="w-full">
        {isMetamaskInstalled ? <EvmConnectButton /> : <MetamaskNotInstalled />}
      </div>
    </>
  );
};

export default ConnectEvmWallet;
