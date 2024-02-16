import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ClaimButton } from './ClaimButton';
import Intl from '@/i18n/i18n';
import { RedeemOperation } from '@/store/operationStore';
import { useOperationStore } from '@/store/store';
import { checkIfUserHasTokensToClaim } from '@/utils/lambdaApi';

export function Claim() {
  const { opToRedeem, setOpToRedeem } = useOperationStore();

  const { address: evmAddress } = useAccount();

  useEffect(() => {
    if (!evmAddress) return;
    // TODO: duplicate code here
    checkIfUserHasTokensToClaim(evmAddress).then((pendingOperations) => {
      setOpToRedeem(pendingOperations);
    });
  }, [evmAddress, setOpToRedeem]);

  const burnListIsNotEmpty = opToRedeem.length;

  if (!evmAddress) {
    console.warn('EVM address not found');
    return null;
  }

  return (
    <div className="flex flex-col w-fit px-40 items-center justify-center gap-6 overflow-scroll">
      {burnListIsNotEmpty ? (
        opToRedeem.map((operation: RedeemOperation) => {
          return (
            <div
              key={operation.inputOpId} // TODO: see if we need that, maybe move it to ClaimButton bellow
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
