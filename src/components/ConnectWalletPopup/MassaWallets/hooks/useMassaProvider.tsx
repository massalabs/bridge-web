import { useEffect } from 'react';

import {
  IProvider,
  providers as getProviders,
} from '@massalabs/wallet-provider';

import { SUPPORTED_MASSA_WALLETS } from '@/const';
import { useAccountStore } from '@/store/store';

export default function useMassaProvider() {
  const {
    setCurrentProvider,
    addProvider,
    setConnectedAccount,
    setAvailableAccounts,
  } = useAccountStore();

  async function addBearbyProvider() {
    const providers = await getProviders();
    for (const provider of providers) {
      if (provider.name() === SUPPORTED_MASSA_WALLETS.BEARBY) {
        // We don't await this promise because it never resolves if bearby wallet is not installed
        await provider.connect();
        addProvider(provider);
      }
    }
  }

  async function selectProvider(provider: IProvider) {
    setCurrentProvider(provider);
    const accounts = await provider.accounts();
    // TODO: Verify we want to use the first account by default
    setConnectedAccount(accounts[0]);
    setAvailableAccounts(accounts);
  }

  async function resetProvider() {
    setCurrentProvider(undefined);
    setConnectedAccount();
    setAvailableAccounts([]);
  }

  useEffect(() => {
    addBearbyProvider();
  }, []);

  return {
    selectProvider,
    resetProvider,
  };
}
