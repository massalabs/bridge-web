import { IProvider } from '@massalabs/wallet-provider';

import { SUPPORTED_MASSA_WALLETS } from '@/const';
import { useAccountStore } from '@/store/store';

export default function useSelectMassaProvider() {
  const { setCurrentProvider, setConnectedAccount, setAvailableAccounts } =
    useAccountStore();

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

  return {
    selectProvider,
    resetProvider,
  };
}
