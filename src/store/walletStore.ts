import { MASSA_STATION } from '@/const';
import { BRIDGE_WALLET } from '@/utils/const';
import {
  _dropFromStorage,
  _getFromStorage,
  _setInStorage,
} from '@/utils/storage';

export interface WalletStoreState {
  currentWallet: string | null;
  wallets: string[];
  isMassaWallet: boolean;

  setCurrentWallet: (wallet: string | null) => void;
  setWallets: (wallets: string[]) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const walletStore = (set: any, _get: any) => ({
  currentWallet: _getFromStorage(BRIDGE_WALLET) ?? 'BEARBY',
  wallets: [],
  isMassaWallet: _getFromStorage(BRIDGE_WALLET) === MASSA_STATION,

  setCurrentWallet: async (wallet: string | null) => {
    if (!wallet) {
      _dropFromStorage(BRIDGE_WALLET);
    } else {
      _setInStorage(BRIDGE_WALLET, wallet);
    }

    set({ currentWallet: wallet, isMassaWallet: wallet === MASSA_STATION });
  },
  setWallets: (wallets: string[]) => set({ wallets: wallets }),
});

export default walletStore;
