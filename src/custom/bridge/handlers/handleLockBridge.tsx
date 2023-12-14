import { toast } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';

import Intl from '../../../i18n/i18n';
import { ILoadingState } from '@/const';
import { CustomError, isParameterError, isRejectedByUser } from '@/utils/error';

export async function handleLockBridge(
  setLoading: (state: ILoadingState) => void,
  amount: string,
  _handleLockEVM: any,
  decimals: number,
) {
  try {
    setLoading({ lock: 'loading' });
    await _handleLockEVM(parseUnits(amount, decimals));
  } catch (error) {
    const typedError = error as CustomError;
    if (isRejectedByUser(typedError)) {
      toast.error(Intl.t(`index.lock.error.rejected`));
      setLoading({ lock: 'error', box: 'error' });
    } else if (isParameterError(typedError)) {
      // if allowance entered in approval is still < amount
      toast.error(Intl.t(`index.lock.error.wrong-allowance`));
      setLoading({ lock: 'error', box: 'error' });
    } else {
      setLoading({ lock: 'error', box: 'error' });
    }
    return false;
  }
  return true;
}
