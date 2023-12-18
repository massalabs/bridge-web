import { toast } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';

import Intl from '../../../i18n/i18n';
import { ILoadingState } from '@/const';
import { CustomError, isParameterError, isRejectedByUser } from '@/utils/error';

interface LockBridgeParams {
  setLoading: (state: ILoadingState) => void;
  amount: string;
  _handleLockEVM: any;
  decimals: number;
}

export async function handleLockBridge({
  setLoading,
  amount,
  _handleLockEVM,
  decimals,
}: LockBridgeParams): Promise<boolean> {
  try {
    setLoading({ lock: 'loading' });
    await _handleLockEVM(parseUnits(amount, decimals));
  } catch (error) {
    handleLockError(error);
    setLoading({ lock: 'error', box: 'error' });
    return false;
  }
  return true;
}

function handleLockError(error: any) {
  const typedError = error as CustomError;
  if (isRejectedByUser(typedError)) {
    toast.error(Intl.t(`index.lock.error.rejected`));
  } else if (isParameterError(typedError)) {
    // if allowance entered in approval is still < amount
    toast.error(Intl.t(`index.lock.error.wrong-allowance`));
  } else {
    toast.error(Intl.t(`index.lock.error.unknown`));
    console.error(error);
  }
}
