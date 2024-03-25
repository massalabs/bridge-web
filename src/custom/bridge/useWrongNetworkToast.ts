import { useEffect } from 'react';
import { toast } from '@massalabs/react-ui-kit';

import { useAccount } from 'wagmi';
import { useConnectorName } from './useConnectorName';
import {
  ChainContext,
  useEvmChainValidation,
  useMassaNetworkValidation,
} from './useWrongNetwork';
import Intl from '@/i18n/i18n';
import { useAccountStore, useBridgeModeStore } from '@/store/store';

export function useWrongIndexNetworkToast() {
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

  const isEthNetworkValid = useEvmChainValidation(ChainContext.BRIDGE);
  const isMassaNetworkValid = useMassaNetworkValidation();
  const toastIdEvm = 'evm';
  const toastIdMassa = 'massa';

  // If wrong network is detected, show a toast
  useEffect(() => {
    if (!chain) {
      toast.dismiss(toastIdEvm);
      return;
    }
    if (!isEthNetworkValid) {
      // In toast, show opposite of current network

      toast.error(
        Intl.t('connect-wallet.wrong-chain', {
          name: walletName,
          network: evmNetwork.toLowerCase(),
        }),
        { id: toastIdEvm },
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
      if (!isMassaNetworkValid) {
        toast.error(
          Intl.t('connect-wallet.wrong-chain', {
            name: currentProvider
              ? Intl.t(`connect-wallet.${currentProvider.name()}`)
              : '',
            network: Intl.t(`general.${massaNetwork}`),
          }),
          {
            id: toastIdMassa,
          },
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
