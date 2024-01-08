// Error const

export interface CustomError extends Error {
  cause?: {
    error: string;
    details: string;
  };
}

export const ERRORS_MESSAGES = [
  'unable to unprotect wallet',
  'TransactionExecutionError: User rejected the request',
];

export const WARNING_MESSAGES = [
  'signing operation: calling executeHTTPRequest for call: aborting during HTTP request',
];

export const PARAMETER_ERROR = [
  'ContractFunctionExecutionError: Execution reverted for an unknown reason',
];

export const ERROR_API = '400';

export const EMPTY_API_RESPONSE = '401';

export const regexErr = new RegExp(ERRORS_MESSAGES.join('|'), 'i');
export const regexWarn = new RegExp(WARNING_MESSAGES.join('|'), 'i');
export const regexParam = new RegExp(PARAMETER_ERROR.join('|'), 'i');

export function isRejectedByUser(error: CustomError): boolean {
  return regexErr.test(error.toString()) || regexWarn.test(error.toString());
}

export function isParameterError(error: CustomError): boolean {
  return regexParam.test(error.toString());
}

export function isApiUrlError(error: CustomError): boolean {
  return error.message === ERROR_API;
}

export function isEmptyApiResponse(error: CustomError): boolean {
  return error.message === EMPTY_API_RESPONSE;
}
