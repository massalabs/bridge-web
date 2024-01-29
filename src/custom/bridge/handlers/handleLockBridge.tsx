import { toast } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';

import Intl from '../../../i18n/i18n';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { CustomError, isParameterError, isRejectedByUser } from '@/utils/error';

export interface LockBridgeParams {
  amount: string;
  _handleLockEVM: any;
  decimals: number;
}

export async function handleLockBridge({
  amount,
  _handleLockEVM,
  decimals,
}: LockBridgeParams): Promise<boolean> {
  const { setBox, setLock } = useGlobalStatusesStore.getState();

  try {
    setLock(Status.Loading);
    await _handleLockEVM(parseUnits(amount, decimals));
  } catch (error) {
    handleLockError(error);
    setLock(Status.Error);
    setBox(Status.Error);
    return false;
  }
  return true;
}

function handleLockError(error: undefined | unknown) {
  const typedError = error as CustomError;
  if (isRejectedByUser(typedError)) {
    toast.error(Intl.t('index.lock.error.rejected'));
  } else if (isParameterError(typedError)) {
    // if allowance entered in approval is still < amount
    toast.error(Intl.t('index.lock.error.wrong-allowance'));
  } else {
    toast.error(Intl.t('index.lock.error.unknown'));
    console.error(error);
  }
}
