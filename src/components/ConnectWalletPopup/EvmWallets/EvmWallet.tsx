import { useAccount } from 'wagmi';
import { EvmConnectButton } from './EvmConnectButton';
import { MetamaskNotInstalled } from './MetamaskNotInstalled';
import { ChainStatus } from '@/components/Status/ChainStatus';
import { useConnectorName } from '@/custom/bridge/useConnectorName';
import { useGetChainValidationContext } from '@/custom/bridge/useNetworkValidation';
import Intl from '@/i18n/i18n';

export function ConnectEvmWallet() {
  const { isConnected } = useAccount();

  // Not scalable if we decide to adopt multiwallet support
  const isMetamaskInstalled = window.ethereum?.isMetaMask;

  const walletName = useConnectorName();

  const { context } = useGetChainValidationContext();

  return (
    <>
      <div className="flex gap-2 items-center mb-4">
        <p className="mas-body">
          {isConnected
            ? walletName
            : Intl.t('connect-wallet.card-destination.from')}
        </p>
        <ChainStatus context={context} isMassaChain={false} />
      </div>
      <div className="w-full">
        {isMetamaskInstalled ? <EvmConnectButton /> : <MetamaskNotInstalled />}
      </div>
    </>
  );
}
