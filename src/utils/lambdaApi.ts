import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ClaimState } from './const';
import { config } from '../const';
import { useBridgeModeStore } from '../store/store';
import { useResource } from '@/custom/api';
import { BurnRedeemOperation } from '@/store/operationStore';

export enum HistoryOperationStatus {
  Claimable = 'claimable',
  Pending = 'pending',
  Done = 'done',
  Error = 'error',
  Unknown = 'unknown',
}

export interface BridgeError {
  title: string;
  msg: string;
  code: number;
}

export enum BridgingState {
  new = 'new',
  processing = 'processing',
  done = 'done',
  error = 'error',
  finalizing = 'finalizing',
}

export interface OperationHistoryItem {
  entity: Entities;
  emitter: string;
  createdAt: string;
  amount: string;
  recipient: string;
  historyStatus: HistoryOperationStatus;
  serverState: BridgingState;
  outputId?: string;
  signatures?: string[];
  inputId: string;
  inputLogIdx?: number;
  evmChainId: number;
  massaToken?: string;
  evmToken?: string;
  confirmations?: number;
  isConfirmed: boolean;
  error?: BridgeError;
}

export enum Entities {
  Burn = 'burn',
  Lock = 'lock',
  ReleaseMAS = 'releaseMAS',
}

export interface LambdaAPIResponse {
  data: OperationHistoryItem[];
}

export const lambdaEndpoint = 'bridge-getHistory-prod';

export function useClaimableOperations() {
  const { address: evmAddress } = useAccount();
  const { currentMode } = useBridgeModeStore.getState();

  const state = BridgingState.processing;
  const queryParams = `?evmAddress=${evmAddress}&entities=${Entities.Burn}&state=${state}`;
  const lambdaUrl = `${config[currentMode].lambdaUrl}${lambdaEndpoint}${queryParams}`;
  const [claimableOperations, setClaimableOperations] = useState<
    BurnRedeemOperation[]
  >([]);

  const { data: burnOperations } =
    useResource<OperationHistoryItem[]>(lambdaUrl);

  useEffect(() => {
    if (!burnOperations?.length) return;

    setClaimableOperations(
      burnOperations
        .filter((op) => !op.outputId) // keep only the ones that are not claimed
        .map((opToClaim) => burnOpApiToDTO(opToClaim)),
    );
  }, [burnOperations]);

  return {
    claimableOperations,
  };
}

export function burnOpApiToDTO(
  burn: OperationHistoryItem,
): BurnRedeemOperation {
  const statesCorrespondence = {
    // Relayer are adding signatures
    [BridgingState.new]: ClaimState.RETRIEVING_INFO,

    // Signatures are added, user can claim, user may have claim, tx may be in a fork
    // if outputTxId is set, we are waiting for evm confirmations
    // it can be ClaimState.AWAITING_SIGNATURE but we can't know from the lambda
    // it can be ClaimState.PENDING but we can't know from the lambda
    // it can be ClaimState.SUCCESS if the outputTxId is set (see bellow)
    [BridgingState.processing]: ClaimState.READY_TO_CLAIM,

    // Relayer are deleting burn log in massa smart contract, we have enough evm confirmations
    [BridgingState.finalizing]: ClaimState.SUCCESS,

    // Relayer have deleted burn log in massa smart contract, we have enough evm confirmations
    [BridgingState.done]: ClaimState.SUCCESS,

    // Error in the process
    [BridgingState.error]: ClaimState.ERROR,
  };

  const op = {
    claimState: statesCorrespondence[burn.serverState],
    emitter: burn.emitter,
    recipient: burn.recipient,
    amount: burn.amount,
    inputId: burn.inputId,
    signatures: burn.signatures || [],
    evmToken: burn.evmToken as `0x${string}`,
    massaToken: burn.massaToken as `AS${string}`,
    outputTxId: burn.outputId,
  };

  // The operation state given by the lambda is processing but the operation may be already claimed
  // if the outputTxId is set, so in this case we set the claimState to SUCCESS
  if (burn.serverState === BridgingState.processing && burn.outputId) {
    op.claimState = ClaimState.SUCCESS;
  }

  return op;
}
