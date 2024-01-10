import { providers } from '@massalabs/wallet-provider';

import { MASSA_STATION } from '@/const';

export async function getCurrentStationNetwork() {
  const providerList = await providers();
  const wallet = providerList.find((p) => p.name() === MASSA_STATION);
  if (!wallet) {
    throw new Error('No wallet found!');
  }
  const network = await wallet.getNetwork();

  return network;
}
