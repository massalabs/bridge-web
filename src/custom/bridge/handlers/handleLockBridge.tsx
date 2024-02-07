import { toast } from '@massalabs/react-ui-kit';
import Intl from '../../../i18n/i18n';
import { CustomError, isParameterError, isRejectedByUser } from '@/utils/error';

export function handleLockError(error: undefined | unknown) {
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
