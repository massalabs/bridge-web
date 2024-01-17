import { useEffect } from 'react';
import { providers as getProviders } from '@massalabs/wallet-provider';

import { SUPPORTED_MASSA_WALLETS } from '@/const';
import { useAccountStore } from '@/store/store';

export default function useSelectMassaProvider() {
  const {
    providers,
    selectedProvider,
    addProvider,
    setCurrentProvider,
    setConnectedAccount,
    setAvailableAccounts,
    setSelectedProvider,
  } = useAccountStore();

  async function getBearbyProvider() {
    const providerList = await getProviders();
    const bearby = providerList.find(
      (provider) => provider.name() === SUPPORTED_MASSA_WALLETS.BEARBY,
    );

    if (!bearby) return;
    await bearby.connect();
    addProvider(bearby);
  }

  async function selectProvider(providerName: SUPPORTED_MASSA_WALLETS) {
    setSelectedProvider(providerName);

    const provider = providers.find((p) => p.name() === providerName);
    if (!provider) return;
    const accounts = await provider.accounts();
    // TODO: Verify we want to use the first account by default
    setConnectedAccount(accounts[0]);
    setAvailableAccounts(accounts);
  }

  function resetProvider() {
    setSelectedProvider(undefined);
    setCurrentProvider(undefined);
    setConnectedAccount();
    setAvailableAccounts([]);
  }

  useEffect(() => {
    getBearbyProvider();
  }, []);

  return {
    selectedProvider,
    selectProvider,
    resetProvider,
  };
}
