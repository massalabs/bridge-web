import { useState, useEffect } from 'react';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { useFetchBurnEvent } from './useFetchBurnEvent';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useOperationStore } from '@/store/operationStore';
import { useAccountStore, useBridgeModeStore } from '@/store/store';
import { useTokenStore } from '@/store/tokenStore';
import { BurnState, ClaimState, EVM_EXPLORER } from '@/utils/const';
import {
  BridgingState,
  HistoryOperationStatus,
  Entities,
} from '@/utils/lambdaApi';
import { linkifyMassaOpIdToExplo } from '@/utils/utils';

export function useHandleBurnRedeem() {
  const { burn, setBurn } = useGlobalStatusesStore();
  const {
    burnTxId,
    appendBurnRedeemOperation,
    amount,
    setBurnState,
    claimTxId,
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

  const [currentExplorerUrl, setCurrentExplorerUrl] = useState<string>('');

  useEffect(() => {
    if (burnTxId && burn !== Status.Success) {
      setCurrentIdToDisplay(burnTxId);
      setCurrentExplorerUrl(linkifyMassaOpIdToExplo(burnTxId as string));
    }
    if (burn === Status.Success) return;
    if (lambdaResponseIsEmpty || !amount || !evmAddress || !selectedToken)
      return;
    if (
      lambdaResponse[0].inputId === burnTxId &&
      lambdaResponse[0].serverState === BridgingState.processing
    ) {
      setBurn(Status.Success);
      setBurnState(BurnState.SUCCESS);
      appendBurnRedeemOperation({
        inputId: burnTxId as string,
        signatures: [],
        claimState: ClaimState.RETRIEVING_INFO,
        amount: parseUnits(amount, selectedToken.decimals).toString(),
        recipient: evmAddress as string,
        evmToken: selectedToken.evmToken,
        massaToken: selectedToken.massaToken,
        emitter: connectedAccount?.address() || '',
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
    amount,
    evmAddress,
    selectedToken,
    burnTxId,
    setBurnState,
    appendBurnRedeemOperation,
    connectedAccount,
  ]);

  useEffect(() => {
    if (burn !== Status.Success && burnTxId) {
      setCurrentIdToDisplay(burnTxId);
      setCurrentExplorerUrl(linkifyMassaOpIdToExplo(burnTxId));
    }
    if (claimTxId && burn === Status.Success) {
      setCurrentIdToDisplay(claimTxId);
      setCurrentExplorerUrl(`${EVM_EXPLORER[currentMode]}tx/${claimTxId}`);
    }
  }, [burn, burnTxId, claimTxId, currentMode]);

  return { currentExplorerUrl, currentIdToDisplay };
}
