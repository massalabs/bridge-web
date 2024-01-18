import { providers } from '@massalabs/wallet-provider';
import { useAccountStore } from '@/store/store';

export async function updateProviders() {
  const {
    addProvider,
    removeProvider,
    providers: currentProviders,
  } = useAccountStore.getState();

  let providerList = await providers();

  // add new providers
  for (const provider of providerList) {
    addProvider(provider);
  }
  // remove old providers
  for (const provider of currentProviders) {
    if (!providerList.some((p) => p.name() === provider.name())) {
      removeProvider(provider);
    }
  }
}

export async function handleBearbyAccountChange(newAddress: string) {
  const { connectedAccount, currentProvider, setConnectedAccount } =
    useAccountStore.getState();

  const oldAddress = connectedAccount?.address();

  if (newAddress !== oldAddress) {
    const newAccounts = await currentProvider?.accounts();

    if (newAccounts?.length) {
      // Bearby returns only one account
      const newAccount = newAccounts[0];
      setConnectedAccount(newAccount);
    }
  }
}
