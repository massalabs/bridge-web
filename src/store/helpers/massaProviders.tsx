import { providers, IProvider } from '@massalabs/wallet-provider';

import { SUPPORTED_MASSA_WALLETS } from '@/const';
import { useAccountStore } from '@/store/store';

export async function addOrRemoveProvider() {
  const providerList = await providers();

  addOrRemoveWalletProvider(providerList, SUPPORTED_MASSA_WALLETS.MASSASTATION);
  addOrRemoveWalletProvider(providerList, SUPPORTED_MASSA_WALLETS.BEARBY, true);
}

async function addOrRemoveWalletProvider(
  providerList: IProvider[],
  walletName: SUPPORTED_MASSA_WALLETS,
  checkNetwork = false,
) {
  const { addProvider, removeProvider } = useAccountStore.getState();

  const walletProvider = providerList.find(
    (provider) => provider.name() === walletName,
  );

  if (walletProvider) {
    // ISSUE: Even if we install or uninstall Bearby, the network result does not change
    // We need to refresh the page to get the correct network result
    if (!checkNetwork || (await walletProvider.getNetwork())) {
      addProvider(walletProvider);
    }
  } else {
    removeProvider(walletName);
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
