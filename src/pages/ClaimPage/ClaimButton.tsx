import { useState } from 'react';

import { useContractRead, erc20ABI } from 'wagmi';

import { ErrorClaim } from './ErrorClaim';
import { InitClaim } from './InitClaim';
import { PendingClaim } from './PendingClaim';
import { RejectedClaim } from './RejectedClaim';
import { SuccessClaim } from './SuccessClaim';
import { useBridgeModeStore } from '../../store/store';
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

  function onRedeemPending() {
    setClaimState(ClaimState.PENDING);
  }

  function onRedeemSuccess(hash: `0x${string}` | null) {
    setClaimState(ClaimState.SUCCESS);
    setTxHash(hash);
  }

  function onRedeemReject() {
    setClaimState(ClaimState.REJECTED);
  }

  function onRedeemError() {
    setClaimState(ClaimState.ERROR);
  }

  const { currentMode } = useBridgeModeStore();

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
                  onRedeemSuccess={onRedeemSuccess}
                  mode={currentMode}
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
                <RejectedClaim operation={operation} symbol={symbol} />
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
                  setClaimState={setClaimState}
                  onRedeemReject={onRedeemReject}
                  onRedeemError={onRedeemError}
                  onRedeemPending={onRedeemPending}
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
