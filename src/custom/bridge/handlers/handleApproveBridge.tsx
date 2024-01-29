import { toast } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';

import Intl from '../../../i18n/i18n';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { CustomError, isRejectedByUser } from '@/utils/error';

export async function handleApproveBridge(
  amount: string,
  decimals: number,
  _handleApproveEVM: () => void,
  _allowanceEVM: bigint,
): Promise<boolean> {
  const { setApprove, setBox } = useGlobalStatusesStore.getState();
  try {
    setApprove(Status.Loading);
    let _amount = parseUnits(amount, decimals);
    if (_allowanceEVM < _amount) {
      await _handleApproveEVM();
      return false;
    }
    setApprove(Status.Success);
  } catch (error) {
    const typedError = error as CustomError;
    if (isRejectedByUser(typedError)) {
      toast.error(Intl.t('index.approve.error.rejected'));
    } else {
      // error comes from increaseAllowanceFunction
      toast.error(Intl.t('index.approve.error.allowance-error'));
    }
    setApprove(Status.Error);
    setBox(Status.Error);
    return false;
  }
  return true;
}
