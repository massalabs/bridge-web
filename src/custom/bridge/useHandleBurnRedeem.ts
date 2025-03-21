import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useFetchBurnEvent } from './useFetchBurnEvent';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useOperationStore } from '@/store/operationStore';
import { useAccountStore, useBridgeModeStore } from '@/store/store';
import { useTokenStore } from '@/store/tokenStore';
import { BurnState, ClaimState } from '@/utils/const';
import {
  BridgingState,
  HistoryOperationStatus,
  Entities,
} from '@/utils/lambdaApi';

export function useHandleBurnRedeem() {
  const { burn, setBurn } = useGlobalStatusesStore();
  const {
    burnTxId,
    appendBurnRedeemOperation,
    inputAmount,
    setBurnState,
    claimTxId,
    outputAmount,
  } = useOperationStore();
  const { connectedAccount } = useAccountStore();
  const { selectedToken } = useTokenStore();
  const { address: evmAddress } = useAccount();
  const { currentMode } = useBridgeModeStore();

  const lambdaResponse = useFetchBurnEvent();

  const lambdaResponseIsEmpty =
    lambdaResponse === undefined || lambdaResponse.length === 0;

  const [currentIdToDisplay, setCurrentIdToDisplay] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (burnTxId && burn !== Status.Success) {
      setBurnState(BurnState.PENDING);
      setCurrentIdToDisplay(burnTxId);
    }
    if (burn === Status.Success) return;
    if (lambdaResponseIsEmpty) return;
    if (
      lambdaResponse[0].inputId === burnTxId &&
      lambdaResponse[0].serverState === BridgingState.processing
    ) {
      setBurn(Status.Success);
      setBurnState(BurnState.SUCCESS);

      if (
        !inputAmount ||
        !outputAmount ||
        !evmAddress ||
        !selectedToken ||
        !connectedAccount
      ) {
        console.warn('Missing data to append burn redeem operation'); // prevent silent fail if missing data
        return;
      }

      appendBurnRedeemOperation({
        inputId: burnTxId as string,
        signatures: [],
        claimState: ClaimState.RETRIEVING_INFO,
        amount: inputAmount.toString(),
        outputAmount: outputAmount.toString(),
        recipient: evmAddress as string,
        evmToken: selectedToken.evmToken,
        massaToken: selectedToken.massaToken,
        emitter: connectedAccount.address(),
        createdAt: new Date().toISOString(),
        serverState: BridgingState.new,
        historyStatus: HistoryOperationStatus.Unknown,
        entity: Entities.Burn,
        evmChainId: selectedToken.chainId,
        isConfirmed: false,
      });
    }
  }, [
    lambdaResponse,
    lambdaResponseIsEmpty,
    setBurn,
    burn,
    inputAmount,
    outputAmount,
    evmAddress,
    selectedToken,
    burnTxId,
    setBurnState,
    appendBurnRedeemOperation,
    connectedAccount,
  ]);

  useEffect(() => {
    if (burn !== Status.Success && burnTxId) {
      // if burn is not a success and we have a burnTxId burn is in progress so show the burn tx id
      setCurrentIdToDisplay(burnTxId);
    }
    if (claimTxId && burn === Status.Success) {
      // if the burn is a success and we have a claimTxId then claim is in progress claimTxId
      setCurrentIdToDisplay(claimTxId);
    }
  }, [burn, burnTxId, claimTxId, currentMode]);

  return { currentIdToDisplay };
}
