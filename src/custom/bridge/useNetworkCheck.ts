import { useEffect, useState } from 'react';
import { toast } from '@massalabs/react-ui-kit';

import { useAccount } from 'wagmi';
import { useConnectorName } from './useConnectorName';
import { useIsBnbConnected } from './useIsBnbConnected';
import {
  isBnbNetworkValid,
  isEthNetworkValid,
  isMassaNetworkValid,
} from '../../utils/networkValidation';
import Intl from '@/i18n/i18n';
import { useAccountStore, useBridgeModeStore } from '@/store/store';

// TODO: merge with useNetworkCheck.ts with useWrongNetwork.ts

// This is only used in the index page... maybe can be refactored

export function useNetworkCheck() {
  const { connectedNetwork, currentProvider } = useAccountStore();
  const { chain } = useAccount();
  const {
    isMainnet: getIsMainnet,
    currentMode,
    evmNetwork: getEvmNetwork,
    massaNetwork: getMassaNetwork,
    bscNetwork: getBscNetwork,
  } = useBridgeModeStore();

  const isMainnet = getIsMainnet();
  const evmNetwork = getEvmNetwork();
  const massaNetwork = getMassaNetwork();
  const bscNetwork = getBscNetwork();

  // state to dismiss toast
  const [wrongNetwork, setWrongNetwork] = useState<boolean>(false);

  const [toastIdEvm, setToastIdEvm] = useState<string>('');
  const [toastIdMassa, setToastIdMassa] = useState<string>('');
  const [toastIdBsc, setToastIdBsc] = useState<string>('');
  const walletName = useConnectorName();

  const isBscConnected = useIsBnbConnected();

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
    if (chain && !isBscConnected && !isEthNetworkValid(isMainnet, chain.id)) {
      setToastIdEvm(
        toast.error(
          Intl.t('connect-wallet.wrong-chain', {
            name: walletName,
            network: evmNetwork.toLowerCase(),
          }),
          { id: 'evm' },
        ),
      );
      setWrongNetwork(true);
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

      setWrongNetwork(true);
    } else {
      toast.dismiss(toastIdMassa);
      massaOk = true;
    }

    // Check and toast BSC
    let bscOk = false;
    if (chain && isBscConnected && !isBnbNetworkValid(isMainnet, chain.id)) {
      setToastIdBsc(
        toast.error(
          Intl.t('connect-wallet.wrong-chain', {
            name: walletName,
            network: bscNetwork.toLowerCase(),
          }),
          { id: 'bsc' },
        ),
      );
      setWrongNetwork(true);
    } else {
      toast.dismiss(toastIdBsc);
      bscOk = true;
    }

    setWrongNetwork(!massaOk || !evmOk || !bscOk);
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
    setWrongNetwork,
    setToastIdMassa,
  ]);

  return { wrongNetwork };
}
