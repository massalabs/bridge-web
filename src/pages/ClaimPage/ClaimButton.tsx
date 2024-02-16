import { ErrorClaim } from './ErrorClaim';
import { InitClaim } from './InitClaim';
import { SuccessClaim } from './SuccessClaim';
import { RedeemOperation } from '@/store/operationStore';
import { useOperationStore } from '@/store/store';
import { useTokenStore } from '@/store/tokenStore';
import { ClaimState } from '@/utils/const';

interface ClaimOperationContainerProps {
  operation: RedeemOperation;
}

// This component takes as props an operation and update it via the operationStore,
// so the current redeem operation in the index page is also updated, as long as the operation item in the claim page.
export function ClaimButton({ operation }: ClaimOperationContainerProps) {
  const { updateOpToRedeemByInputOpId } = useOperationStore();
  const { tokens } = useTokenStore();

  const symbol = tokens.find(
    (t) => t.evmToken === operation.evmToken,
  )?.symbolEVM;

  const onReset = () => {
    updateOpToRedeemByInputOpId(operation.inputOpId, {
      claimState: ClaimState.READY_TO_CLAIM,
    });
  };

  const onUpdate = (op: Partial<RedeemOperation>) => {
    updateOpToRedeemByInputOpId(operation.inputOpId, op);
  };

  return (
    <div className="flex w-full justify-center">
      {(() => {
        switch (operation.claimState) {
          case ClaimState.SUCCESS:
            return (
              <div className="flex w-full justify-center">
                <SuccessClaim operation={operation} symbol={symbol} />
              </div>
            );
          case ClaimState.AWAITING_SIGNATURE:
          case ClaimState.READY_TO_CLAIM:
          case ClaimState.RETRIEVING_INFO:
          case ClaimState.PENDING:
          case ClaimState.REJECTED:
            return (
              <div className="flex w-full justify-center">
                <InitClaim
                  onUpdate={onUpdate}
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
                  onReset={onReset}
                  symbol={symbol}
                />
              </div>
            );
        }
      })()}
    </div>
  );
}
