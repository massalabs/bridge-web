import { useEffect, useState } from 'react';
import { toast } from '@massalabs/react-ui-kit';
import { bsc, bscTestnet } from 'viem/chains';
import { useAccount } from 'wagmi';
import { useConnectorName } from './useConnectorName';
import Intl from '@/i18n/i18n';
import { useBridgeModeStore } from '@/store/store';

export function useBnbNetworkToast(): boolean | undefined {
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const { chain } = useAccount();
  const isMainnet = getIsMainnet();
  const walletName = useConnectorName();

  const targetChainId = isMainnet ? bsc.id : bscTestnet.id;
  const isValidChain = chain?.id === targetChainId;

  const [isBnbChainValid, setIsBnbChainValid] = useState<boolean>();
  const bnbToastID = 'BNB';

  useEffect(() => {
    if (!isValidChain) {
      toast.error(
        Intl.t('dao-maker.wrong-chain', {
          name: walletName,
          network: isMainnet ? bsc.name : bscTestnet.name,
        }),
        { id: bnbToastID },
      );
      setIsBnbChainValid(false);
    }
    setIsBnbChainValid(true);
    toast.dismiss(bnbToastID);
  }, [isValidChain, isMainnet, walletName]);

  return isBnbChainValid;
}
