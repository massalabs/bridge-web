import { ErrorClaim } from './ErrorClaim';
import { InitClaim } from './InitClaim';
import { SuccessClaim } from './SuccessClaim';
import { BurnRedeemOperation } from '@/store/operationStore';
import { useOperationStore } from '@/store/store';
import { useTokenStore } from '@/store/tokenStore';
import { ClaimState } from '@/utils/const';

interface ClaimOperationContainerProps {
  operation: BurnRedeemOperation;
}

// This component takes as props an operation and update it via the operationStore,
// so the current redeem operation in the index page is also updated, as long as the operation item in the claim page.
export function ClaimButton({ operation }: ClaimOperationContainerProps) {
  const { updateBurnRedeemOperationById } = useOperationStore();
  const { tokens } = useTokenStore();

  const symbol = tokens.find(
    (t) => t.evmToken === operation.evmToken,
  )?.symbolEVM;
  const decimals = tokens.find(
    (t) => t.evmToken === operation.evmToken,
  )?.decimals;

  const onReset = () => {
    updateBurnRedeemOperationById(operation.inputId, {
      claimState: ClaimState.READY_TO_CLAIM,
    });
  };

  const onUpdate = (op: Partial<BurnRedeemOperation>) => {
    updateBurnRedeemOperationById(operation.inputId, op);
  };

  return (
    <div className="flex w-full justify-center">
      {(() => {
        switch (operation.claimState) {
          case ClaimState.SUCCESS:
            return (
              <div className="flex w-full justify-center">
                <SuccessClaim
                  operation={operation}
                  symbol={symbol}
                  decimals={decimals}
                />
              </div>
            );
          case ClaimState.AWAITING_SIGNATURE:
          case ClaimState.READY_TO_CLAIM:
          case ClaimState.PENDING:
          case ClaimState.REJECTED:
            return (
              <div className="flex w-full justify-center">
                <InitClaim
                  onUpdate={onUpdate}
                  operation={operation}
                  symbol={symbol}
                  decimals={decimals}
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
                  decimals={decimals}
                />
              </div>
            );
        }
      })()}
    </div>
  );
}
