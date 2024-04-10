import { toast } from '@massalabs/react-ui-kit';
import Intl from '../../../i18n/i18n';
import { TIMEOUT } from '@/const';
import { BurnState, ClaimState } from '@/utils/const';
import {
  CustomError,
  isOperationAlreadyExecutedError,
  isParameterError,
  isRejectedByUser,
  isWalletTimeoutError,
} from '@/utils/error';

export function handleLockError(error: Error) {
  if (isRejectedByUser(error)) {
    toast.error(Intl.t('index.lock.error.rejected'), { id: error.message });
  } else if (isParameterError(error)) {
    // if allowance entered in approval is still < amount
    toast.error(Intl.t('index.lock.error.wrong-allowance'), {
      id: error.message,
    });
  } else {
    toast.error(Intl.t('index.lock.error.unknown'), { id: error.message });
    console.error(error);
  }
}

export function handleEvmApproveError(error: Error) {
  if (isRejectedByUser(error)) {
    toast.error(Intl.t('index.approve.error.rejected'), { id: error.message });
  } else {
    toast.error(Intl.t('index.approve.error.allowance-error'), {
      id: error.message,
    });
  }
}

export function handleEvmClaimError(error: Error): ClaimState {
  console.error(error);
  if (isRejectedByUser(error)) {
    toast.error(Intl.t('claim.rejected'), { id: error.message });
    return ClaimState.REJECTED;
  } else if (isOperationAlreadyExecutedError(error)) {
    toast.error(Intl.t('claim.already-executed'), { id: error.message });
    return ClaimState.ALREADY_EXECUTED;
  } else {
    toast.error(Intl.t('claim.error-toast'), { id: error.message });
    return ClaimState.ERROR;
  }
}

export function handleEvmClaimBoxError(error: Error): ClaimState {
  if (isRejectedByUser(error)) {
    toast.error(Intl.t('index.claim.error.rejected'), { id: error.message });
    return ClaimState.REJECTED;
  } else {
    toast.error(Intl.t('index.claim.error.unknown'), { id: error.message });
    console.error(error);
    return ClaimState.ERROR;
  }
}

export function handleBurnError(error: undefined | unknown) {
  const typedError = error as CustomError;
  const isErrorTimeout = typedError.cause?.error === TIMEOUT;
  console.log(isRejectedByUser(typedError));
  if (isRejectedByUser(typedError)) {
    toast.error(Intl.t('index.burn.error.rejected'));
    // setBurnState(BurnState.REJECTED);
    console.log(BurnState.REJECTED);
  } else if (isWalletTimeoutError(typedError)) {
    toast.error(Intl.t('index.burn.error.timeout-signature'));
    // setBurnState(BurnState.SIGNATURE_TIMEOUT);
    console.log(BurnState.SIGNATURE_TIMEOUT);
  } else if (isErrorTimeout) {
    // when waitIncludedOperation fails to wait operation finality
    // setBurnState(BurnState.OPERATION_FINALITY_TIMEOUT);
    console.log(BurnState.OPERATION_FINALITY_TIMEOUT);
    toast.error(Intl.t('index.burn.error.timeout'));
  } else {
    // setBurnState(BurnState.ERROR);
    console.log(BurnState.ERROR);
    toast.error(Intl.t('index.burn.error.unknown'));
    console.error(error);
  }
}
