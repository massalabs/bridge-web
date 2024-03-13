import { useEffect, useState } from 'react';
import { toast } from '@massalabs/react-ui-kit';

import { useAccount } from 'wagmi';
import { useConnectorName } from './useConnectorName';
import Intl from '@/i18n/i18n';
import { useAccountStore, useBridgeModeStore } from '@/store/store';
import {
  isEthNetworkValid,
  isMassaNetworkValid,
} from '@/utils/networkValidation';

export function useWrongNetworkToast() {
  const { chain } = useAccount();

  const { chainId, currentProvider } = useAccountStore();
  const {
    isMainnet: getIsMainnet,
    currentMode,
    evmNetwork: getEvmNetwork,
    massaNetwork: getMassaNetwork,
  } = useBridgeModeStore();

  const isMainnet = getIsMainnet();
  const evmNetwork = getEvmNetwork();
  const massaNetwork = getMassaNetwork();
  const walletName = useConnectorName();

  // state to dismiss toast
  const [toastIdEvm, setToastIdEvm] = useState<string>('');
  const [toastIdMassa, setToastIdMassa] = useState<string>('');

  useEffect(() => {
    // if not wallet is detected, do not show toast
    // useful when switching between wallets
    if (!currentProvider) {
      toast.dismiss(toastIdMassa);
      return;
    }
    // If wrong network is detected, show a toast
    // in toast, show opposite of current network

    // Check and toast EVM
    if (chain && !isEthNetworkValid(isMainnet, chain.id)) {
      setToastIdEvm(
        toast.error(
          Intl.t('connect-wallet.wrong-chain', {
            name: walletName,
            network: evmNetwork.toLowerCase(),
          }),
          { id: 'evm' },
        ),
      );
    } else {
      toast.dismiss(toastIdEvm);
    }

    // Check and toast Massa
    if (chainId && !isMassaNetworkValid(isMainnet, chainId)) {
      setToastIdMassa(
        toast.error(
          Intl.t('connect-wallet.wrong-chain', {
            name: currentProvider
              ? Intl.t(`connect-wallet.${currentProvider.name()}`)
              : '',
            network: massaNetwork,
          }),
          {
            id: 'massa',
          },
        ),
      );
    } else {
      toast.dismiss(toastIdMassa);
    }
  }, [
    currentMode,
    chain,
    chainId,
    isMainnet,
    toastIdEvm,
    toastIdMassa,
    currentProvider,
    evmNetwork,
    massaNetwork,
    setToastIdEvm,
    setToastIdMassa,
    walletName,
  ]);
}
