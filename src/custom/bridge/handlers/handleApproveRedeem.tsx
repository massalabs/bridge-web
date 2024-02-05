import { toast } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';
import { U256_MAX } from '../../../const/const';
import Intl from '../../../i18n/i18n';
import { useTokenStore } from '../../../store/tokenStore';
import { increaseAllowance } from '../bridge';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import {
  CustomError,
  isInsufficientBalanceError,
  isRejectedByUser,
} from '@/utils/error';

export async function handleApproveRedeem(amount: string) {
  const { setApprove, setBox } = useGlobalStatusesStore.getState();
  try {
    const { selectedToken } = useTokenStore.getState();
    setApprove(Status.Loading);

    const _amount = parseUnits(amount, selectedToken!.decimals);
    if (selectedToken!.allowance < _amount) {
      await increaseAllowance(U256_MAX);
    }

    setApprove(Status.Success);
  } catch (error) {
    const typedError = error as CustomError;
    const isErrorTimeout =
      typedError.cause && typedError.cause.error === 'timeout';
    if (isInsufficientBalanceError(error as Error)) {
      toast.error(Intl.t('index.approve.error.insufficient-funds'));
    } else if (isRejectedByUser(typedError)) {
      toast.error(Intl.t('index.approve.error.rejected'));
    } else if (isErrorTimeout) {
      // if there is timeout during waitIncludedOperation
      toast.error(Intl.t('index.approve.error.timeout'));
    } else {
      // error during allowance increase
      toast.error(Intl.t('index.approve.error.allowance-error'));
    }

    setBox(Status.Error);
    setApprove(Status.Error);
    return false;
  }
  return true;
}
