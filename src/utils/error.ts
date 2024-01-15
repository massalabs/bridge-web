// Error const

export interface CustomError extends Error {
  cause?: {
    error: string;
    details: string;
  };
}

const ERRORS_MESSAGES = [
  'unable to unprotect wallet',
  'TransactionExecutionError: User rejected the request',
];

const WARNING_MESSAGES = [
  'signing operation: calling executeHTTPRequest for call: aborting during HTTP request',
];

const PARAMETER_ERROR = [
  'ContractFunctionExecutionError: Execution reverted for an unknown reason',
];

const BALANCE_ERROR = 'does not have enough balance to pay';

export const regexErr = new RegExp(ERRORS_MESSAGES.join('|'), 'i');
export const regexWarn = new RegExp(WARNING_MESSAGES.join('|'), 'i');
export const regexParam = new RegExp(PARAMETER_ERROR.join('|'), 'i');

export function isRejectedByUser(error: CustomError): boolean {
  return regexErr.test(error.toString()) || regexWarn.test(error.toString());
}

export function isParameterError(error: CustomError): boolean {
  return regexParam.test(error.toString());
}

export function isInsufficientBalanceError(error: Error): boolean {
  return !!error?.toString().includes(BALANCE_ERROR);
}
