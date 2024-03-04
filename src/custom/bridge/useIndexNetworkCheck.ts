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

export function useIndexNetworkCheck() {
  const { chain } = useAccount();

  const { connectedNetwork, currentProvider } = useAccountStore();
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
  const [wrongIndexNetwork, setWrongIndexNetwork] = useState<boolean>(false);
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
    let evmOk = false;
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
      setWrongIndexNetwork(true);
    } else {
      toast.dismiss(toastIdEvm);
      evmOk = true;
    }

    // Check and toast Massa
    let massaOk = false;
    if (connectedNetwork && !isMassaNetworkValid(isMainnet, connectedNetwork)) {
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

      setWrongIndexNetwork(true);
    } else {
      toast.dismiss(toastIdMassa);
      massaOk = true;
    }
    setWrongIndexNetwork(!massaOk || !evmOk);
  }, [
    currentMode,
    chain,
    connectedNetwork,
    isMainnet,
    toastIdEvm,
    toastIdMassa,
    currentProvider,
    evmNetwork,
    massaNetwork,
    setToastIdEvm,
    setWrongIndexNetwork,
    setToastIdMassa,
    walletName,
  ]);

  return { wrongIndexNetwork };
}
