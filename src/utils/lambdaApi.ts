import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { LambdaHookHistory } from './bridgeHistory';
import { ClaimState } from './const';
import { config } from '../const';
import { useBridgeModeStore } from '../store/store';
import { useResource } from '@/custom/api';
import { BurnRedeemOperation } from '@/store/operationStore';

export interface Locked {
  amount: string;
  evmChainId: number;
  evmToken: `0x${string}`;
  massaToken: `AS${string}`;
  inputTxId: `0x${string}`;
  recipient: string;
  state: ApiOperationStates;
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
  state: ApiOperationStates;
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

export enum Entities {
  Burn = 'burn',
  Lock = 'lock',
  ReleaseMAS = 'releaseMAS',
}

export interface LambdaAPIResponse {
  data: { locked: Locked[]; burned: Burned[] };
}

export const lambdaEndpoint = 'bridge-getHistory-prod';

export enum ApiOperationStates {
  new = 'new',
  processing = 'processing',
  done = 'done',
  error = 'error',
  finalizing = 'finalizing',
}

function sortSignatures(signatures: Signatures[]): Signatures[] {
  return signatures.sort((a, b) => a.relayerId - b.relayerId);
}

export function useClaimableOperations() {
  const { address: evmAddress } = useAccount();
  const { currentMode } = useBridgeModeStore.getState();

  const state = ApiOperationStates.processing;
  const queryParams = `?evmAddress=${evmAddress}&entities=${Entities.Burn}&state=${state}`;
  const lambdaUrl = `${config[currentMode].lambdaUrl}${lambdaEndpoint}${queryParams}`;
  const [claimableOperations, setClaimableOperations] = useState<
    BurnRedeemOperation[]
  >([]);

  const { data: lambdaResponse } = useResource<LambdaHookHistory>(lambdaUrl);

  useEffect(() => {
    if (!lambdaResponse?.burned.length) return;

    setClaimableOperations(
      lambdaResponse.burned
        .filter((op) => !op.outputTxId) // keep only the ones that are not claimed
        .map((opToClaim) => burnOpApiToDTO(opToClaim)),
    );
  }, [lambdaResponse]);

  return {
    claimableOperations,
  };
}

export function burnOpApiToDTO(burn: Burned): BurnRedeemOperation {
  const statesCorrespondence = {
    // Relayer are adding signatures
    [ApiOperationStates.new]: ClaimState.RETRIEVING_INFO,

    // Signatures are added, user can claim, user may have claim, tx may be in a fork
    // if outputTxId is set, we are waiting for evm confirmations
    // it can be ClaimState.AWAITING_SIGNATURE but we can't know from the lambda
    // it can be ClaimState.PENDING but we can't know from the lambda
    // it can be ClaimState.SUCCESS if the outputTxId is set (see bellow)
    [ApiOperationStates.processing]: ClaimState.READY_TO_CLAIM,

    // Relayer are deleting burn log in massa smart contract, we have enough evm confirmations
    [ApiOperationStates.finalizing]: ClaimState.SUCCESS,

    // Relayer have deleted burn log in massa smart contract, we have enough evm confirmations
    [ApiOperationStates.done]: ClaimState.SUCCESS,

    // Error in the process
    [ApiOperationStates.error]: ClaimState.ERROR,
  };

  const op = {
    claimState: statesCorrespondence[burn.state],
    emitter: burn.emitter,
    recipient: burn.recipient,
    amount: burn.amount,
    inputId: burn.inputOpId,
    signatures: sortSignatures(burn.signatures).map((s) => s.signature),
    evmToken: burn.evmToken,
    massaToken: burn.massaToken,
    outputTxId: undefined,
  };

  // The operation state given by the lambda is processing but the operation may be already claimed
  // if the outputTxId is set, so in this case we set the claimState to SUCCESS
  if (burn.state === ApiOperationStates.processing && burn.outputTxId) {
    op.claimState = ClaimState.SUCCESS;
  }

  return op;
}
