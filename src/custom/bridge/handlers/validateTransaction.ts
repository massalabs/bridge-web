import Intl from '@/i18n/i18n';
import {
  useGlobalStatusesStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';

export function validate(tokenBalanceEVM: any) {
  const { inputAmount: amount, isMassaToEvm } = useOperationStore.getState();
  const { selectedToken } = useTokenStore.getState();
  const { setAmountError } = useGlobalStatusesStore.getState();
  const massaToEvm = isMassaToEvm();
  setAmountError(undefined);

  if (!amount || !selectedToken) {
    setAmountError(Intl.t('index.approve.error.invalid-amount'));
    return false;
  }

  let _balance;

  if (massaToEvm) {
    _balance = selectedToken?.balance || 0n;
  } else {
    _balance = tokenBalanceEVM;
  }

  if (amount <= 0n) {
    setAmountError(Intl.t('index.approve.error.invalid-amount'));
    return false;
  }

  if (_balance < amount) {
    setAmountError(Intl.t('index.approve.error.insufficient-funds'));
    return false;
  }

  return true;
}
