import { toast } from '@massalabs/react-ui-kit';
import Intl from '../../../i18n/i18n';
import { ClaimState } from '@/utils/const';
import {
  isOperationAlreadyExecutedError,
  isParameterError,
  isRejectedByUser,
} from '@/utils/error';

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

export function handleEvmClaimError(error: Error): ClaimState {
  if (isRejectedByUser(error)) {
    toast.error(Intl.t('claim.rejected'));
    return ClaimState.REJECTED;
  } else if (isOperationAlreadyExecutedError(error)) {
    toast.error(Intl.t('claim.already-executed'));
    return ClaimState.ALREADY_EXECUTED;
  } else {
    toast.error(Intl.t('claim.error-toast'));
    return ClaimState.ERROR;
  }
}

export function handleEvmClaimBoxError(error: Error): ClaimState {
  if (isRejectedByUser(error)) {
    toast.error(Intl.t('index.claim.error.rejected'));
    return ClaimState.REJECTED;
  } else {
    toast.error(Intl.t('index.claim.error.unknown'));
    console.error(error);
    return ClaimState.ERROR;
  }
}
