import { useState } from 'react';

import { useContractRead, erc20ABI } from 'wagmi';

import { InitialClaim } from './InitialClaim';
import { PendingClaim } from './PendingClaim';
import { SuccessClaim } from './SuccessClaim';
import { RedeemOperationToClaim } from '@/utils/lambdaApi';

export enum ClaimState {
  NONE = 'none',
  PENDING = 'pending',
  SUCCESS = 'success',
}

interface ClaimOperationContainerProps {
  operation: RedeemOperationToClaim;
}

export function ClaimButton(args: ClaimOperationContainerProps) {
  const { operation } = args;
  const [claimState, setClaimState] = useState(ClaimState.NONE);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  function onRedeemSuccess(hash: `0x${string}` | null) {
    setClaimState(ClaimState.SUCCESS);
    setTxHash(hash);
  }

  const _symbol = useContractRead({
    address: operation.evmToken,
    abi: erc20ABI,
    functionName: 'symbol',
  });

  const symbol = _symbol.data;

  return (
    <>
      {(() => {
        switch (claimState) {
          case ClaimState.PENDING:
            return (
              <div className="flex w-full justify-center">
                <PendingClaim onRedeemSuccess={onRedeemSuccess} />
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
          default:
            return (
              <div className="flex w-full justify-center">
                <InitialClaim
                  setClaimState={setClaimState}
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
