import axios from 'axios';

import { ClaimState } from './const';
import { config } from '../const';
import { useBridgeModeStore } from '../store/store';
import { BurnRedeemOperation } from '@/store/operationStore';

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
  isConfirmed: boolean;
  createdAt: string;
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
  isConfirmed: boolean;
  outputConfirmations: number;
  createdAt: string;
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

export async function getBridgeHistory(
  evmAddress: `0x${string}`,
): Promise<{ locked: Locked[]; burned: Burned[] }> {
  const { currentMode } = useBridgeModeStore.getState();

  let response: LambdaResponse;
  if (!evmAddress) return { locked: [], burned: [] };
  try {
    response = await axios.get(config[currentMode].lambdaUrl + lambdaEndpoint, {
      params: {
        evmAddress,
      },
    });
  } catch (error: any) {
    console.warn('Error getting burned by evm address', error?.response?.data);
    return { locked: [], burned: [] };
  }
  return response.data;
}

async function getBurnedByEvmAddress(
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

enum operationStates {
  new = 'new',
  processing = 'processing',
  done = 'done',
  error = 'error',
  finalizing = 'finalizing',
}

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

export async function getRedeemOperation(
  evmAddress: `0x${string}`,
): Promise<BurnRedeemOperation[]> {
  const burnedOpList = await getBurnedByEvmAddress(evmAddress);

  const statesCorrespondence = {
    // Relayer are adding signatures
    [operationStates.new]: ClaimState.RETRIEVING_INFO,

    // Signatures are added, user can claim, user may have claim, tx may be in a fork
    // if outputTxId is set, we are waiting for evm confirmations
    // it can be ClaimState.AWAITING_SIGNATURE but we can't know from the lambda
    // it can be ClaimState.PENDING but we can't know from the lambda
    // it can be ClaimState.SUCCESS if the outputTxId is set (see bellow)
    [operationStates.processing]: ClaimState.READY_TO_CLAIM,

    // Relayer are deleting burn log in massa smart contract, we have enough evm confirmations
    [operationStates.finalizing]: ClaimState.SUCCESS,

    // Relayer have deleted burn log in massa smart contract, we have enough evm confirmations
    [operationStates.done]: ClaimState.SUCCESS,

    // Error in the process
    [operationStates.error]: ClaimState.ERROR,
  };

  return burnedOpList.map((opToClaim) => {
    const op = {
      claimState: statesCorrespondence[opToClaim.state],
      emitter: opToClaim.emitter,
      recipient: opToClaim.recipient,
      amount: opToClaim.amount,
      inputId: opToClaim.inputOpId,
      signatures: sortSignatures(opToClaim.signatures).map((s) => s.signature),
      evmToken: opToClaim.evmToken,
      massaToken: opToClaim.massaToken,
      outputTxId: undefined,
    };

    // The operation state given by the lambda is processing but the operation may be already claimed
    // if the outputTxId is set, so in this case we set the claimState to SUCCESS
    if (
      opToClaim.state === operationStates.processing &&
      opToClaim.outputTxId
    ) {
      op.claimState = ClaimState.SUCCESS;
    }

    return op;
  });
}

export async function getClaimableOperations(
  evmAddress: `0x${string}`,
): Promise<BurnRedeemOperation[]> {
  const redeemOperations = await getRedeemOperation(evmAddress);

  return redeemOperations.filter(
    (op) => op.claimState === ClaimState.READY_TO_CLAIM,
  );
}

export function formatApiCreationTime(inputTimestamp: string) {
  const dateObject = new Date(inputTimestamp);
  const formattedTimestamp = dateObject.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  });

  return formattedTimestamp;
}

export function isEvmToMassa(address: string): boolean {
  const regex = /^0x/i;

  if (regex.test(address)) {
    return true;
  }
  return false;
}
