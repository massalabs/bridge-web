import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ClaimState } from './const';
import { config } from '../const';
import { useBridgeModeStore, useGlobalStatusesStore } from '../store/store';
import { useResource } from '@/custom/api/useResource';
import { BurnRedeemOperation, useOperationStore } from '@/store/operationStore';

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
  const { currentMode } = useBridgeModeStore();

  const state = BridgingState.processing;
  const queryParams = `?evmAddress=${evmAddress}&entities=${Entities.Burn}&state=${state}`;
  const lambdaUrl = `${config[currentMode].lambdaUrl}${lambdaEndpoint}${queryParams}`;
  const [claimableOperations, setClaimableOperations] = useState<
    BurnRedeemOperation[]
  >([]);

  const { data: burnOperations } =
    useResource<OperationHistoryItem[]>(lambdaUrl);

  useEffect(() => {
    if (!burnOperations?.length) {
      setClaimableOperations([]);
      return;
    }

    setClaimableOperations(
      burnOperations
        .filter((op) => !op.outputId) // keep only the ones that are not claimed
        .map((opToClaim) => burnOpApiToDTO(opToClaim)),
    );
  }, [burnOperations, setClaimableOperations]);

  return {
    claimableOperations,
  };
}

export function burnOpApiToDTO(
  burn: OperationHistoryItem,
): BurnRedeemOperation {
  const op = {
    ...burn,
    claimState: getClaimState(burn.serverState, burn.isConfirmed),
  };

  return op;
}

function getClaimState(
  serverState: BridgingState,
  isConfirmed?: boolean,
): ClaimState {
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

  const claimState = statesCorrespondence[serverState];

  // The operation state given by the lambda is processing but the operation may be already claimed
  // if the outputTxId is set, so in this case we set the claimState to SUCCESS
  if (serverState === BridgingState.processing && isConfirmed) {
    return ClaimState.SUCCESS;
  }

  return claimState;
}

export function useFetchSignatures() {
  const { burnTxId, getCurrentRedeemOperation, updateBurnRedeemOperationById } =
    useOperationStore();
  const { setBox } = useGlobalStatusesStore();
  const { currentMode } = useBridgeModeStore();
  const { address: evmAddress } = useAccount();

  const state = BridgingState.processing;
  const queryParams = `?evmAddress=${evmAddress}&inputOpId=${burnTxId}&entities=${Entities.Burn}&state=${state}`;
  const lambdaUrl = `${config[currentMode].lambdaUrl}${lambdaEndpoint}${queryParams}`;
  const [enableRefetch, setEnableRefetch] = useState(true);

  const { data: burnOperations } = useResource<OperationHistoryItem[]>(
    lambdaUrl,
    enableRefetch,
  );

  useEffect(() => {
    if (!burnTxId) return;
    if (!burnOperations?.length) return;

    // find the operation
    const claimableOp = burnOperations.find((item) => item.outputId === null);
    if (!claimableOp) return;

    setEnableRefetch(false);
    // update the store
    const op = burnOpApiToDTO(claimableOp);
    updateBurnRedeemOperationById(burnTxId, {
      signatures: op.signatures,
    });
    if (
      getCurrentRedeemOperation()?.claimState === ClaimState.RETRIEVING_INFO
    ) {
      updateBurnRedeemOperationById(burnTxId, {
        claimState: ClaimState.READY_TO_CLAIM,
      });
    }
  }, [
    burnTxId,
    burnOperations,
    setBox,
    getCurrentRedeemOperation,
    updateBurnRedeemOperationById,
  ]);
}
