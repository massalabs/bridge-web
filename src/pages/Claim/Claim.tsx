import { useEffect, useState } from 'react';

import { useAccount, useContractEvent } from 'wagmi';

import { ClaimButton } from './ClaimButton';
import { ClaimPending } from './ClaimPending';
import { ClaimSuccess } from './ClaimSuccess';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { EVM_BRIDGE_ADDRESS } from '@/const';
import { useAccountStore, useOperationStore } from '@/store/store';
import {
  RedeemOperationToClaim,
  checkIfUserHasTokensToClaim,
} from '@/utils/lambdaApi';

export function Claim() {
  const [connectedAccount] = useAccountStore((state) => [
    state.connectedAccount,
  ]);
  const [opToRedeem, setOpToRedeem] = useOperationStore((state) => [
    state.opToRedeem,
    state.setOpToRedeem,
  ]);
  const [claimState, setClaimState] = useState(ClaimState.NONE);
  const { address: evmAddress } = useAccount();
  const massaAddress = connectedAccount?.address();

  useEffect(() => {
    getApiInfo();
  }, []);

  async function getApiInfo() {
    if (!massaAddress || !evmAddress) return;

    const pendingOperations = await checkIfUserHasTokensToClaim(
      massaAddress,
      evmAddress,
    );
    setOpToRedeem(pendingOperations);
  }

  const redeemEventHandler = useContractEvent({
    address: EVM_BRIDGE_ADDRESS,
    abi: bridgeVaultAbi,
    eventName: 'Redeemed',
    listener() {
      setClaimState(ClaimState.SUCCESS);
      redeemEventHandler?.();
    },
  });

  const burnListIsNotEmpty = opToRedeem.length;

  return (
    <div className="flex flex-col w-full items-center justify-center h-[60vh]">
      {burnListIsNotEmpty ? (
        opToRedeem.map((operation: RedeemOperationToClaim) => {
          switch (claimState) {
            case ClaimState.PENDING:
              return <ClaimPending opId={operation.inputOpId} />;
            case ClaimState.SUCCESS:
              return <ClaimSuccess operation={operation} />;
            default:
              return (
                <ClaimButton
                  setClaimState={setClaimState}
                  operation={operation}
                />
              );
          }
        })
      ) : (
        <p className="bg-red-500">no operations</p>
      )}
    </div>
  );
}

export enum ClaimState {
  NONE = 'none',
  PENDING = 'pending',
  SUCCESS = 'success',
}
