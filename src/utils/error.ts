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

const WARNING_MESSAGE =
  'signing operation: calling executeHTTPRequest for call: aborting during HTTP request';

const PARAMETER_ERROR =
  'ContractFunctionExecutionError: Execution reverted for an unknown reason';

const CONTRACT_REJECTED =
  'ContractFunctionExecutionError: The contract function "redeem" reverted with the following reason:';

const BALANCE_ERROR = 'does not have enough balance to pay';

export const regexErr = new RegExp(ERRORS_MESSAGES.join('|'), 'i');
export const regexWarn = new RegExp(WARNING_MESSAGE, 'i');
export const regexParam = new RegExp(PARAMETER_ERROR, 'i');
export const regexOperation = new RegExp(CONTRACT_REJECTED, 'i');

export function isRejectedByUser(error: Error): boolean {
  return regexErr.test(error.toString());
}

export function isWalletTimeoutError(error: Error): boolean {
  return regexWarn.test(error.toString());
}

export function isParameterError(error: Error): boolean {
  return regexParam.test(error.toString());
}

export function isInsufficientBalanceError(error: Error): boolean {
  return !!error?.toString().includes(BALANCE_ERROR);
}

export function isOperationAlreadyExecutedError(error: Error): boolean {
  return regexOperation.test(error.toString());
}
