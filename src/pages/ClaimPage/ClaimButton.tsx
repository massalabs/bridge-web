import { useState } from 'react';
import { ErrorClaim } from './ErrorClaim';
import { InitClaim } from './InitClaim';
import { SuccessClaim } from './SuccessClaim';
import { useTokenStore } from '@/store/tokenStore';
import { ClaimState } from '@/utils/const';
import { RedeemOperationToClaim } from '@/utils/lambdaApi';

interface ClaimOperationContainerProps {
  operation: RedeemOperationToClaim;
}

export function ClaimButton({ operation }: ClaimOperationContainerProps) {
  const [claimState, setClaimState] = useState(ClaimState.INIT);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
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
                  setClaimState={setClaimState}
                  setHash={setTxHash}
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
                  setClaimState={setClaimState} // TODO: rename to onClick,
                  // update the local state and the store if necessary
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
