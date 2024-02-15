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
  const [claimState, setClaimState] = useState(ClaimState.INIT);
  const { currentRedeemOperation, updateCurrentRedeemOperation } =
    useOperationStore();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const updateFilteredCurrentRedeemOperation = useCallback(
    (op: Partial<CurrentRedeemOperation>) => {
      // update the local states
      if (op.state) {
        setClaimState(op.state);
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
          case ClaimState.REJECTED:
          case ClaimState.PENDING:
          case ClaimState.INIT:
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
                      state: ClaimState.INIT,
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
