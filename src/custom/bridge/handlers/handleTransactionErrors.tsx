import { toast } from '@massalabs/react-ui-kit';
import Intl from '../../../i18n/i18n';
import { isParameterError, isRejectedByUser } from '@/utils/error';

export function handleLockError(error: Error) {
  if (isRejectedByUser(error)) {
    toast.error(Intl.t('index.lock.error.rejected'));
  } else if (isParameterError(error)) {
    // if allowance entered in approval is still < amount
    toast.error(Intl.t('index.lock.error.wrong-allowance'));
  } else {
    toast.error(Intl.t('index.lock.error.unknown'));
    console.error(error);
  }
}

export function handleEvmApproveError(error: Error) {
  if (isRejectedByUser(error)) {
    toast.error(Intl.t('index.approve.error.rejected'));
  } else {
    toast.error(Intl.t('index.approve.error.allowance-error'));
  }
}
