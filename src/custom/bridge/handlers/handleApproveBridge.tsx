import { toast } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';

import Intl from '../../../i18n/i18n';
import { ILoadingState } from '@/const';
import { ICustomError, regexErr, regexWarn } from '@/utils/const';

export async function handleApproveBridge(
  setLoading: (state: ILoadingState) => void,
  amount: string,
  decimals: number,
  _handleApproveEVM: any,
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
    const typedError = error as ICustomError;
    if (
      regexErr.test(typedError.toString()) ||
      regexWarn.test(typedError.toString())
    ) {
      // user rejects operation
      toast.error(Intl.t(`index.approve.error.rejected`));
    } else {
      // error comes from increaseAllaoanceFunction
      toast.error(Intl.t(`index.approve.error.allowance-error`));
    }
    setLoading({ approve: 'error', box: 'error' });
    return false;
  }
  return true;
}
