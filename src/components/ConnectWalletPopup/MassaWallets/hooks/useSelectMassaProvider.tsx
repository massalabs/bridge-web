import { useEffect } from 'react';
import { IProvider, providers } from '@massalabs/wallet-provider';

import { SUPPORTED_MASSA_WALLETS } from '@/const';
import { useAccountStore } from '@/store/store';

export default function useSelectMassaProvider() {
  const {
    setCurrentProvider,
    setConnectedAccount,
    setAvailableAccounts,
    addProvider,
  } = useAccountStore();

  async function getBearbyProvider() {
    const providerList = await providers();
    const bearby = providerList.find(
      (provider) => provider.name() === SUPPORTED_MASSA_WALLETS.BEARBY,
    );

    if (!bearby) return;
    await bearby.connect();
    addProvider(bearby);
  }

  async function selectProvider(provider: IProvider) {
    if (
      provider.name() === SUPPORTED_MASSA_WALLETS.BEARBY &&
      !(await provider.connect())
    ) {
      return;
    }

    setCurrentProvider(provider);
    const accounts = await provider.accounts();
    // TODO: Verify we want to use the first account by default
    setConnectedAccount(accounts[0]);
    setAvailableAccounts(accounts);
  }

  function resetProvider() {
    setCurrentProvider(undefined);
    setConnectedAccount();
    setAvailableAccounts([]);
  }

  useEffect(() => {
    getBearbyProvider();
  }, []);

  return {
    selectProvider,
    resetProvider,
  };
}
