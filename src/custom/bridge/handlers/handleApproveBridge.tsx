import { toast } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';

import Intl from '../../../i18n/i18n';
import { LoadingState } from '@/const';
import { CustomError, isRejectedByUser } from '@/utils/error';

export async function handleApproveBridge(
  setLoading: (state: LoadingState) => void,
  amount: string,
  decimals: number,
  _handleApproveEVM: () => void,
  _allowanceEVM: bigint,
): Promise<boolean> {
  try {
    setLoading({ approve: 'loading' });
    let _amount = parseUnits(amount, decimals);
    if (_allowanceEVM < _amount) {
      await _handleApproveEVM();
      return false;
    }
    setLoading({ approve: 'success' });
  } catch (error) {
    const typedError = error as CustomError;
    if (isRejectedByUser(typedError)) {
      toast.error(Intl.t(`index.approve.error.rejected`));
    } else {
      // error comes from increaseAllowanceFunction
      toast.error(Intl.t(`index.approve.error.allowance-error`));
    }
    setLoading({ approve: 'error', box: 'error' });
    return false;
  }
  return true;
}
