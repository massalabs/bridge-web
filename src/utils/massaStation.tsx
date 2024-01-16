import { providers } from '@massalabs/wallet-provider';

import { SUPPORTED_MASSA_WALLETS } from '@/const';
import { useAccountStore } from '@/store/store';

export async function addOrRemoveStationProvider() {
  const { addProvider, removeProvider } = useAccountStore.getState();
  const providerList = await providers();
  const massaStationProvider = providerList.find(
    (provider) => provider.name() === SUPPORTED_MASSA_WALLETS.MASSASTATION,
  );

  if (massaStationProvider) {
    addProvider(massaStationProvider);
  } else {
    removeProvider(SUPPORTED_MASSA_WALLETS.MASSASTATION);
  }
}
