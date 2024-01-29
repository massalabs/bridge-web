import { toast } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';

import Intl from '../../../i18n/i18n';
import { Status, GlobalStatusesStoreState } from '@/store/globalStatusesStore';
import { CustomError, isRejectedByUser } from '@/utils/error';

export async function handleApproveBridge(
  amount: string,
  decimals: number,
  _handleApproveEVM: () => void,
  _allowanceEVM: bigint,
  globalStatusesStore: GlobalStatusesStoreState,
): Promise<boolean> {
  try {
    globalStatusesStore.setApprove(Status.Loading);
    let _amount = parseUnits(amount, decimals);
    if (_allowanceEVM < _amount) {
      await _handleApproveEVM();
      return false;
    }
    globalStatusesStore.setApprove(Status.Success);
  } catch (error) {
    const typedError = error as CustomError;
    if (isRejectedByUser(typedError)) {
      toast.error(Intl.t('index.approve.error.rejected'));
    } else {
      // error comes from increaseAllowanceFunction
      toast.error(Intl.t('index.approve.error.allowance-error'));
    }
    globalStatusesStore.setApprove(Status.Error);
    globalStatusesStore.setBox(Status.Error);
    return false;
  }
  return true;
}
