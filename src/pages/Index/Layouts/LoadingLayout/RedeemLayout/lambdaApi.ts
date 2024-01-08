import axios from 'axios';

import { EMPTY_API_RESPONSE, ERROR_API } from '@/utils/error';

export interface Locked {
  amount: string;
  evmChainId: number;
  inputTxId: `0x${string}`;
  recipient: string;
  state: string;
  error: {
    msg: string;
    code: number;
    title: string;
  };
  emitter: `0x${string}`;
  outputOpId: string;
}

export interface Burned {
  amount: string;
  outputTxId: `0x${string}` | null;
  ecmChainId: number;
  recipient: `0x${string}`;
  state: string;
  error: null | string;
  emitter: string;
  inputOpId: string;
  signatures: Signatures[];
}

export interface Signatures {
  signature: `0x${string}`;
  relayerId: number;
}

export interface LambdaResponse {
  data: {
    locked: Locked[];
    burned: Burned[];
  };
}

export async function getBurnedOperationInfo(
  evmAddress: `0x${string}`,
  massaAddress: string,
  endPoint: string,
): Promise<Burned[]> {
  const lambdaURL: string = import.meta.env.VITE_LAMBDA_URL;
  if (!lambdaURL) throw new Error(ERROR_API);
  const response: LambdaResponse = await axios.get(lambdaURL + endPoint, {
    params: {
      evmAddress,
      massaAddress,
    },
  });
  if (!response.data) throw new Error(EMPTY_API_RESPONSE);
  return response.data.burned;
}

export const endPoint = 'bridge-getHistory-prod';

export enum opertationStates {
  new = 'new',
  processing = 'processing',
  done = 'done',
  error = 'error',
  finalizing = 'finalizing',
}
