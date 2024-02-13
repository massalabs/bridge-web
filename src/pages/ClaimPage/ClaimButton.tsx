import { ErrorClaim } from './ErrorClaim';
import { InitClaim } from './InitClaim';
import { SuccessClaim } from './SuccessClaim';
import { RedeemOperation } from '@/store/operationStore';
import { useTokenStore } from '@/store/tokenStore';
import { ClaimState } from '@/utils/const';

interface ClaimOperationContainerProps {
  operation: RedeemOperation;
}

export function ClaimButton(props: ClaimOperationContainerProps) {
  const { operation } = props;
  const { tokens } = useTokenStore();

  const symbol = tokens.find(
    (t) => t.evmToken === operation.evmToken,
  )?.symbolEVM;

  return (
    <>
      {(() => {
        switch (operation.claimStatus) {
          case ClaimState.SUCCESS:
            return (
              <div className="flex w-full justify-center">
                <SuccessClaim operation={operation} symbol={symbol} />
              </div>
            );
          case ClaimState.REJECTED:
          case ClaimState.PENDING:
          case ClaimState.INIT:
            return (
              <div className="flex w-full justify-center">
                <InitClaim operation={operation} symbol={symbol} />
              </div>
            );
          case ClaimState.ERROR:
          case ClaimState.ALREADY_EXECUTED:
            return (
              <div>
                <ErrorClaim operation={operation} symbol={symbol} />
              </div>
            );
        }
      })()}
    </>
  );
}
