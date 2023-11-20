import { toast } from '@massalabs/react-ui-kit';

import Intl from '../../../i18n/i18n';
import { ILoadingState } from '@/const';

export interface ICustomError extends Error {
  cause?: {
    error: string;
    details: string;
  };
}

export function handleErrorMessage(
  error: Error,
  setLoading: (state: ILoadingState) => void,
  setRedeemSteps: (state: string) => void,
  setAmount: (state: string) => void,
) {
  const ERRORS_MESSAGES = [
    'unable to unprotect wallet',
    'TransactionExecutionError: User rejected the request',
  ];

  const WARNING_MESSAGES = [
    'signing operation: calling executeHTTPRequest for call: aborting during HTTP request',
  ];

  const regexWarn = new RegExp(WARNING_MESSAGES.join('|'), 'i');
  const regexErr = new RegExp(ERRORS_MESSAGES.join('|'), 'i');

  const cause = (error as ICustomError)?.cause;
  const isTimeout = cause?.error === 'timeout';

  // bridge side this fn only show timeout error
  if (isTimeout) {
    setLoading({
      box: 'warning',
      mint: 'warning',
    });
  }

  if (regexWarn.test(error.toString())) {
    setRedeemSteps(Intl.t(`index.bridge.error.sign-timeout`));
    setLoading({
      box: 'error',
      burn: 'error',
      redeem: 'error',
    });
  } else if (regexErr.test(error.toString())) {
    handleClosePopUp(setLoading, setAmount);
  } else {
    toast.error(Intl.t(`index.bridge.error.general`));
    setLoading({
      box: 'error',
      burn: 'error',
      redeem: 'error',
      error: 'error',
    });
  }
}

export function handleClosePopUp(
  setLoading: (state: ILoadingState) => void,
  setAmount: (state: string) => void,
) {
  setLoading({
    box: 'none',
    approve: 'none',
    burn: 'none',
    redeem: 'none',
    lock: 'none',
    mint: 'none',
    error: 'none',
  });
  setAmount('');
}
