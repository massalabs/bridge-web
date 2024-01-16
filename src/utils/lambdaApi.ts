import axios from 'axios';

export interface Locked {
  amount: string;
  evmChainId: number;
  evmToken: `0x${string}`;
  massaToken: `AS${string}`;
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
  evmToken: `0x${string}`;
  massaToken: `AS${string}`;
  evmChainId: number;
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

export interface RedeemOperationToClaim {
  amount: string;
  recipient: `0x${string}`;
  inputOpId: string;
  signatures: string[];
  evmToken: `0x${string}`;
}

export async function getBurnedByEvmAddress(
  evmAddress: `0x${string}`,
  endPoint: string,
): Promise<Burned[]> {
  const lambdaURL: string = import.meta.env.VITE_LAMBDA_URL;
  if (!lambdaURL) throw new Error("Unable to get 'VITE_LAMBDA_URL' from .env");
  const response: LambdaResponse = await axios.get(lambdaURL + endPoint, {
    params: {
      evmAddress,
    },
  });

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

// returns all processing operations with a burn operation id
export function filterByOpId(
  BurnedOpList: Burned[],
  operationId: string,
): Burned | undefined {
  return BurnedOpList.find(
    (item) =>
      item.outputTxId === null &&
      item.state === opertationStates.processing &&
      item.inputOpId === operationId,
  );
}

export function getOperationsToClaim(
  operationsArray: Burned[],
): RedeemOperationToClaim[] {
  return operationsArray.map((opToClaim) => ({
    recipient: opToClaim.recipient,
    amount: opToClaim.amount,
    inputOpId: opToClaim.inputOpId,
    signatures: sortSignatures(opToClaim.signatures),
    evmToken: opToClaim.evmToken,
  }));
}

export function sortSignatures(signatures: Signatures[]): string[] {
  const sortedSignatures = signatures.sort((a, b) => a.relayerId - b.relayerId);

  const signaturesInOrder = sortedSignatures.map((signature: Signatures) => {
    return signature.signature;
  });
  return signaturesInOrder;
}

export async function checkIfUserHasTokensToClaim(
  evmAddress: `0x${string}`,
): Promise<RedeemOperationToClaim[]> {
  const burnedOpList = await getBurnedByEvmAddress(evmAddress, endPoint);

  return burnedOpList
    .filter(
      (item) =>
        item.outputTxId === null &&
        item.state === opertationStates.processing &&
        item.recipient === evmAddress,
    )
    .map((opToClaim) => ({
      recipient: opToClaim.recipient,
      amount: opToClaim.amount,
      inputOpId: opToClaim.inputOpId,
      signatures: sortSignatures(opToClaim.signatures),
      evmToken: opToClaim.evmToken,
    }));
}
