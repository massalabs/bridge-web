import { useEffect } from 'react';
import { toast } from '@massalabs/react-ui-kit';
import { useAccount } from 'wagmi';
import { EvmConnectButton } from './EvmConnectButton';
import { MetamaskNotInstalled } from './MetamaskNotInstalled';
import { ChainStatus } from '@/components/Status/ChainStatus';
import { Blockchain } from '@/const';
import { useConnectorName } from '@/custom/bridge/useConnectorName';
import { useIsBnbConnected } from '@/custom/bridge/useIsBnbConnected';
import Intl from '@/i18n/i18n';

export function ConnectEvmWallet() {
  const { isConnected } = useAccount();

  // Not scalable if we decide to adopt multiwallet support
  const isMetamaskInstalled = window.ethereum?.isMetaMask;

  const walletName = useConnectorName();

  const isBscConnected = useIsBnbConnected();

  useEffect(() => {
    if (isBscConnected) {
      toast(Intl.t('dao-maker.dao-toast'));
    }
  }, [isBscConnected]);

  const currentChain = isBscConnected ? Blockchain.BSC : Blockchain.ETHEREUM;

  return (
    <>
      <div className="flex gap-2 items-center mb-4">
        <p className="mas-body">
          {isConnected
            ? walletName
            : Intl.t('connect-wallet.card-destination.from')}
        </p>
        <ChainStatus blockchain={currentChain} />
      </div>
      <div className="w-full">
        {isMetamaskInstalled ? <EvmConnectButton /> : <MetamaskNotInstalled />}
      </div>
    </>
  );
}
