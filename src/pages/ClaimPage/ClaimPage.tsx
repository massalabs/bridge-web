import { useEffect } from 'react';

import { useAccount } from 'wagmi';

import { ClaimButton } from './ClaimButton';
import Intl from '@/i18n/i18n';
import { useBridgeModeStore, useOperationStore } from '@/store/store';
import {
  RedeemOperationToClaim,
  checkIfUserHasTokensToClaim,
} from '@/utils/lambdaApi';

export function Claim() {
  const { opToRedeem, setOpToRedeem } = useOperationStore();

  const { address: evmAddress } = useAccount();

  if (!evmAddress) throw new Error('EVM address not found');

  const { currentMode } = useBridgeModeStore();

  useEffect(() => {
    if (!evmAddress) return;

    checkIfUserHasTokensToClaim(currentMode, evmAddress).then(
      (pendingOperations) => {
        setOpToRedeem(pendingOperations);
      },
    );
  }, [evmAddress, currentMode, setOpToRedeem]);

  const burnListIsNotEmpty = opToRedeem.length;

  return (
    <div className="flex flex-col w-fit px-40 items-center justify-center h-[70vh] gap-6 overflow-scroll">
      {burnListIsNotEmpty ? (
        opToRedeem.map((operation: RedeemOperationToClaim) => {
          return (
            <div
              key={operation.inputOpId}
              className="flex w-full justify-center"
            >
              <ClaimButton operation={operation} />
            </div>
          );
        })
      ) : (
        <p className="mas-menu-active text-info text-2xl">
          {Intl.t('claim.no-claim', { address: evmAddress })}
        </p>
      )}
    </div>
  );
}
