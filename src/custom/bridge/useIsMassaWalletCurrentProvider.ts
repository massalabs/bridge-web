import { SUPPORTED_MASSA_WALLETS } from '@/const';
import { useAccountStore } from '@/store/store';

export function useIsMassaWalletCurrentProvider(): boolean {
  const { currentProvider } = useAccountStore();
  if (!currentProvider) return false;
  if (currentProvider.name() === SUPPORTED_MASSA_WALLETS.MASSASTATION) {
    return true;
  }
  return false;
}
