import { useState } from 'react';

import { useContractRead, erc20ABI } from 'wagmi';

import { ErrorClaim } from './ErrorClaim';
import { InitClaim } from './InitClaim';
import { PendingClaim } from './PendingClaim';
import { RejectedClaim } from './RejectedClaim';
import { SuccessClaim } from './SuccessClaim';
import { RedeemOperationToClaim } from '@/utils/lambdaApi';

export enum ClaimState {
  INIT = 'init',
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
  REJECTED = 'rejected',
}

interface ClaimOperationContainerProps {
  operation: RedeemOperationToClaim;
}

export function ClaimButton({ operation }: ClaimOperationContainerProps) {
  const [claimState, setClaimState] = useState(ClaimState.INIT);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  function onStateChange(state: ClaimState, txHash?: `0x${string}` | null) {
    switch (state) {
      case ClaimState.PENDING:
        setClaimState(ClaimState.PENDING);
        break;
      case ClaimState.SUCCESS:
        if (txHash) {
          setTxHash(txHash);
        }
        setClaimState(ClaimState.SUCCESS);
        break;
      case ClaimState.REJECTED:
        setClaimState(ClaimState.REJECTED);
        break;
      case ClaimState.ERROR:
        setClaimState(ClaimState.ERROR);
        break;
    }
  }

  // TODO: put this in a store (token store ?)
  const { data: symbol } = useContractRead({
    address: operation.evmToken,
    abi: erc20ABI,
    functionName: 'symbol',
  });

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
            return (
              <div className="flex w-full justify-center">
                <RejectedClaim
                  operation={operation}
                  symbol={symbol}
                  onStateChange={onStateChange}
                />
              </div>
            );
          case ClaimState.ERROR:
            return (
              <div>
                <ErrorClaim />
              </div>
            );
          default:
            return (
              <div className="flex w-full justify-center">
                <InitClaim
                  onStateChange={onStateChange}
                  operation={operation}
                  symbol={symbol}
                />
              </div>
            );
        }
      })()}
    </>
  );
}
