import axios from 'axios';

import { BridgeMode, config } from '../const';

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
  mode: BridgeMode,
  evmAddress: `0x${string}`,
  endPoint: string,
): Promise<Burned[]> {
  let response: LambdaResponse;
  try {
    response = await axios.get(config[mode].lambdaUrl + endPoint, {
      params: {
        evmAddress,
      },
    });
  } catch (error: any) {
    console.warn('Error getting burned by evm address', error?.response?.data);
    return [];
  }

  return response.data.burned;
}

export const endPoint = 'bridge-getHistory-prod';

export enum operationStates {
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
      item.state === operationStates.processing &&
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
  mode: BridgeMode,
  evmAddress: `0x${string}`,
): Promise<RedeemOperationToClaim[]> {
  const burnedOpList = await getBurnedByEvmAddress(mode, evmAddress, endPoint);

  return burnedOpList
    .filter(
      (item) =>
        item.outputTxId === null &&
        item.state === operationStates.processing &&
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
