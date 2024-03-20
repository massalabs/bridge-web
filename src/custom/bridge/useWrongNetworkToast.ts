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

  // If wrong network is detected, show a toast
  // In toast, show opposite of current network

  useEffect(() => {
    if (!chain) {
      toast.dismiss(toastIdEvm);
      return;
    }
    if (!isEthNetworkValid(isMainnet, chain.id)) {
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
  }, [currentMode, walletName, evmNetwork, toastIdEvm, chain, isMainnet]);

  useEffect(() => {
    if (!currentProvider || !chainId) {
      // if not wallet is detected, do not show toast
      // useful when switching between wallets
      toast.dismiss(toastIdMassa);
    } else {
      if (!isMassaNetworkValid(isMainnet, chainId)) {
        setToastIdMassa(
          toast.error(
            Intl.t('connect-wallet.wrong-chain', {
              name: currentProvider
                ? Intl.t(`connect-wallet.${currentProvider.name()}`)
                : '',
              network: Intl.t(`general.${massaNetwork}`),
            }),
            {
              id: 'massa',
            },
          ),
        );
      } else {
        toast.dismiss(toastIdMassa);
      }
    }
  }, [
    currentMode,
    currentProvider,
    massaNetwork,
    toastIdMassa,
    chainId,
    isMainnet,
  ]);
}
