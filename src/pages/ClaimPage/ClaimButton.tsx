import { useCallback, useState } from 'react';
import { ErrorClaim } from './ErrorClaim';
import { InitClaim } from './InitClaim';
import { SuccessClaim } from './SuccessClaim';
import { CurrentRedeemOperation } from '@/store/operationStore';
import { useOperationStore } from '@/store/store';
import { useTokenStore } from '@/store/tokenStore';
import { ClaimState } from '@/utils/const';
import { RedeemOperationToClaim } from '@/utils/lambdaApi';

interface ClaimOperationContainerProps {
  operation: RedeemOperationToClaim;
}

export function ClaimButton({ operation }: ClaimOperationContainerProps) {
  const { currentRedeemOperation, updateCurrentRedeemOperation } =
    useOperationStore();
  const [claimState, setClaimState] = useState(
    currentRedeemOperation?.inputOpId === operation.inputOpId
      ? currentRedeemOperation.claimState
      : ClaimState.AWAITING_SIGNATURE,
  );
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const updateFilteredCurrentRedeemOperation = useCallback(
    (op: Partial<CurrentRedeemOperation>) => {
      // update the local states
      if (op.claimState) {
        setClaimState(op.claimState);
      }
      if (op.outputOpId) {
        setTxHash(op.outputOpId as `0x${string}`);
      }
      // update the global state (store)
      if (currentRedeemOperation?.inputOpId === operation.inputOpId) {
        updateCurrentRedeemOperation(op);
      }
    },
    [currentRedeemOperation, operation, updateCurrentRedeemOperation],
  );
  const { tokens } = useTokenStore();

  const symbol = tokens.find(
    (t) => t.evmToken === operation.evmToken,
  )?.symbolEVM;

  return (
    <>
      {(() => {
        switch (claimState) {
          case ClaimState.SUCCESS:
            return (
              <div className="flex w-full justify-center">
                <SuccessClaim
                  operation={operation}
                  txHash={txHash}
                  symbol={symbol}
                />
              </div>
            );
          case ClaimState.AWAITING_SIGNATURE:
          case ClaimState.RETRIEVING_INFO:
          case ClaimState.PENDING:
          case ClaimState.REJECTED:
            return (
              <div className="flex w-full justify-center">
                <InitClaim
                  onUpdate={updateFilteredCurrentRedeemOperation}
                  claimState={claimState}
                  operation={operation}
                  symbol={symbol}
                />
              </div>
            );
          case ClaimState.ERROR:
          case ClaimState.ALREADY_EXECUTED:
            return (
              <div>
                <ErrorClaim
                  operation={operation}
                  onReset={() =>
                    updateFilteredCurrentRedeemOperation({
                      claimState: ClaimState.AWAITING_SIGNATURE,
                    })
                  }
                  claimState={claimState}
                  symbol={symbol}
                />
              </div>
            );
        }
      })()}
    </>
  );
}
