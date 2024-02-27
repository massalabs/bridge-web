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
  state: apiOperationStates;
  error: null | ApiError;
  emitter: `0x${string}`;
  outputOpId: string;
  isConfirmed: boolean;
  createdAt: string;
}

interface ApiError {
  msg: string;
  code: number;
  title: string;
}

export interface Burned {
  amount: string;
  outputTxId: `0x${string}` | null;
  evmToken: `0x${string}`;
  massaToken: `AS${string}`;
  evmChainId: number;
  recipient: `0x${string}`;
  state: apiOperationStates;
  error: null | ApiError;
  emitter: string;
  inputOpId: string;
  signatures: Signatures[];
  isConfirmed: boolean;
  outputConfirmations: number | null;
  createdAt: string;
}

export interface Signatures {
  signature: `0x${string}`;
  relayerId: number;
}

export interface LambdaAPIResponse {
  data: { locked: Locked[]; burned: Burned[] };
}

export const lambdaEndpoint = 'bridge-getHistory-prod';

const { currentMode } = useBridgeModeStore.getState();

export const lambdaUrl = `${config[currentMode].lambdaUrl}${lambdaEndpoint}?evmAddress=`;

async function getBurnedByEvmAddress(
  evmAddress: `0x${string}`,
): Promise<Burned[]> {
  const { currentMode } = useBridgeModeStore.getState();

  let response: LambdaAPIResponse;
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

enum apiOperationStates {
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
      item.state === apiOperationStates.processing &&
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
    [apiOperationStates.new]: ClaimState.RETRIEVING_INFO,

    // Signatures are added, user can claim, user may have claim, tx may be in a fork
    // if outputTxId is set, we are waiting for evm confirmations
    // it can be ClaimState.AWAITING_SIGNATURE but we can't know from the lambda
    // it can be ClaimState.PENDING but we can't know from the lambda
    // it can be ClaimState.SUCCESS if the outputTxId is set (see bellow)
    [apiOperationStates.processing]: ClaimState.READY_TO_CLAIM,

    // Relayer are deleting burn log in massa smart contract, we have enough evm confirmations
    [apiOperationStates.finalizing]: ClaimState.SUCCESS,

    // Relayer have deleted burn log in massa smart contract, we have enough evm confirmations
    [apiOperationStates.done]: ClaimState.SUCCESS,

    // Error in the process
    [apiOperationStates.error]: ClaimState.ERROR,
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
      opToClaim.state === apiOperationStates.processing &&
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
