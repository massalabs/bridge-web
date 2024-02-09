import { useState } from 'react';
import { ErrorClaim } from './ErrorClaim';
import { InitClaim } from './InitClaim';
import { PendingClaim } from './PendingClaim';
import { SuccessClaim } from './SuccessClaim';
import { useTokenStore } from '@/store/tokenStore';
import { RedeemOperationToClaim } from '@/utils/lambdaApi';

export enum ClaimState {
  INIT = 'init',
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
  REJECTED = 'rejected',
  ALREADY_EXECUTED = 'already-executed',
}

interface ClaimOperationContainerProps {
  operation: RedeemOperationToClaim;
}

export function ClaimButton({ operation }: ClaimOperationContainerProps) {
  const { tokens } = useTokenStore();
  const [claimState, setClaimState] = useState(ClaimState.INIT);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const symbol = tokens.find(
    (t) => t.evmToken === operation.evmToken,
  )?.symbolEVM;

  function onStateChange(state: ClaimState, txHash?: `0x${string}` | null) {
    setClaimState(state);
    if (state === ClaimState.SUCCESS && txHash) {
      setTxHash(txHash);
    }
  }

  return (
    <>
      {(() => {
        switch (claimState) {
          case ClaimState.PENDING:
            return (
              <div className="flex w-full justify-center">
                <PendingClaim
                  onStateChange={onStateChange}
                  inputOpId={operation.inputOpId}
                />
              </div>
            );
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
          case ClaimState.INIT:
            return (
              <div className="flex w-full justify-center">
                <InitClaim
                  onStateChange={onStateChange}
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
                  onStateChange={onStateChange}
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
