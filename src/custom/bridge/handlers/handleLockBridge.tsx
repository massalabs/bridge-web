import { toast } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';

import Intl from '../../../i18n/i18n';
import { GlobalStatusesStoreState, Status } from '@/store/globalStatusesStore';
import { CustomError, isParameterError, isRejectedByUser } from '@/utils/error';

export interface LockBridgeParams {
  amount: string;
  _handleLockEVM: any;
  decimals: number;
  globalStatusesStore: GlobalStatusesStoreState;
}

export async function handleLockBridge({
  amount,
  _handleLockEVM,
  decimals,
  globalStatusesStore,
}: LockBridgeParams): Promise<boolean> {
  try {
    globalStatusesStore.setLock(Status.Loading);
    await _handleLockEVM(parseUnits(amount, decimals));
  } catch (error) {
    handleLockError(error);
    globalStatusesStore.setLock(Status.Error);
    globalStatusesStore.setBox(Status.Error);
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
