import { useEffect } from 'react';
import { toast } from '@massalabs/react-ui-kit';
import { useLocation } from 'react-router-dom';

import { useAccount } from 'wagmi';
import { useConnectorName } from './useConnectorName';
import {
  ChainContext,
  useEvmChainValidation,
  useGetChainValidationContext,
  useMassaNetworkValidation,
} from './useNetworkValidation';
import Intl from '@/i18n/i18n';
import { useAccountStore, useBridgeModeStore } from '@/store/store';

export function useWrongNetworkToast() {
  const { pathname } = useLocation();
  const { chain, isConnected } = useAccount();

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

  const { context } = useGetChainValidationContext();

  const isEvmNetworkValid = useEvmChainValidation(context);
  const isMassaNetworkValid = useMassaNetworkValidation();
  const toastIdEvm = 'evm';
  const toastIdMassa = 'massa';

  // If wrong network is detected, show a toast
  useEffect(() => {
    if (!isEvmNetworkValid && context !== ChainContext.CONNECT && isConnected) {
      // In toast, show opposite of current network

      toast.error(Intl.t('connect-wallet.wrong-chain-evm'), { id: toastIdEvm });
    } else {
      toast.dismiss(toastIdEvm);
    }
  }, [
    currentMode,
    walletName,
    evmNetwork,
    toastIdEvm,
    chain,
    isMainnet,
    isEvmNetworkValid,
    context,
    pathname,
    isConnected,
  ]);

  useEffect(() => {
    if (!currentProvider || !chainId) {
      // if not wallet is detected, do not show toast
      // useful when switching between wallets
      toast.dismiss(toastIdMassa);
    } else {
      if (!isMassaNetworkValid && context !== ChainContext.CONNECT) {
        toast.error(
          Intl.t('connect-wallet.wrong-chain-massa', {
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
    isMassaNetworkValid,
    context,
    pathname,
  ]);
}
