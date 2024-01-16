import { useEffect } from 'react';

import {
  IProvider,
  providers as getProviders,
} from '@massalabs/wallet-provider';

import { useAccountStore } from '@/store/store';

export default function useMassaProvider() {
  const [
    currentProvider,
    setCurrentProvider,
    providerList,
    addProvider,
    setConnectedAccount,
    setAvailableAccounts,
  ] = useAccountStore((state) => [
    state.currentProvider,
    state.setCurrentProvider,
    state.providers,
    state.addProvider,
    state.setConnectedAccount,
    state.setAvailableAccounts,
  ]);

  async function addBearbyProvider(bearby: IProvider) {
    // Warning: this promise never resolves if bearby wallet is not installed
    // It's the reason why we don't await addBearbyProvider in initProvider
    await bearby.connect();
    addProvider(bearby);
  }

  async function initProvider() {
    const providers = await getProviders();
    for (const provider of providers) {
      if (provider.name() === 'BEARBY') {
        // We don't await this promise because it never resolves if bearby wallet is not installed
        addBearbyProvider(provider);
      }
      if (provider.name() === 'MASSASTATION') {
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
    initProvider();
  }, []);

  return {
    providerList,
    currentProvider,
    selectProvider,
    resetProvider,
  };
}
