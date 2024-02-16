import axios from 'axios';

import { ClaimState } from './const';
import { config } from '../const';
import { useBridgeModeStore } from '../store/store';
import { RedeemOperation } from '@/store/operationStore';

export interface Locked {
  amount: string;
  evmChainId: number;
  evmToken: `0x${string}`;
  massaToken: `AS${string}`;
  inputTxId: `0x${string}`;
  recipient: string;
  state: operationStates;
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
  state: operationStates;
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

const lambdaEndpoint = 'bridge-getHistory-prod';

export async function getBurnedByEvmAddress(
  evmAddress: `0x${string}`,
): Promise<Burned[]> {
  const { currentMode } = useBridgeModeStore.getState();

  let response: LambdaResponse;
  if (!evmAddress) return [];
  try {
    response = await axios.get(config[currentMode].lambdaUrl + lambdaEndpoint, {
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

export enum operationStates {
  new = 'new',
  processing = 'processing',
  done = 'done',
  error = 'error',
  finalizing = 'finalizing',
}

// returns all processing operations with a burn operation id
export async function findClaimable(
  userEvmAddress: `0x${string}`,
  burnOpId: string,
): Promise<Burned | undefined> {
  const burnedOpList = await getBurnedByEvmAddress(userEvmAddress);

  const claimableOp = burnedOpList.find(
    (item) =>
      item.outputTxId === null &&
      item.state === operationStates.processing &&
      item.inputOpId === burnOpId,
  );

  if (!claimableOp) return;

  claimableOp.signatures = sortSignatures(claimableOp.signatures || []);

  return claimableOp;
}

function sortSignatures(signatures: Signatures[]): Signatures[] {
  return signatures.sort((a, b) => a.relayerId - b.relayerId);
}

export async function checkIfUserHasTokensToClaim(
  evmAddress: `0x${string}`,
): Promise<RedeemOperation[]> {
  const burnedOpList = await getBurnedByEvmAddress(evmAddress);

  return burnedOpList
    .filter(
      (item) =>
        item.outputTxId === null && item.state === operationStates.processing,
    )
    .map((opToClaim) => ({
      claimState: ClaimState.AWAITING_SIGNATURE,
      recipient: opToClaim.recipient,
      amount: opToClaim.amount,
      inputOpId: opToClaim.inputOpId,
      signatures: sortSignatures(opToClaim.signatures).map((s) => s.signature),
      evmToken: opToClaim.evmToken,
      outputTxId: undefined,
    }));
}
