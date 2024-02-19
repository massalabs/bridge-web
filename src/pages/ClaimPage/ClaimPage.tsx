import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ClaimButton } from './ClaimButton';
import Intl from '@/i18n/i18n';
import { RedeemOperation } from '@/store/operationStore';
import { useOperationStore } from '@/store/store';
import { getClaimableOperations } from '@/utils/lambdaApi';

export function ClaimPage() {
  const { opToRedeem, setOpToRedeem } = useOperationStore();
  const { address: evmAddress } = useAccount();

  useEffect(() => {
    if (!evmAddress) return;
    getClaimableOperations(evmAddress).then((newOps) => {
      setOpToRedeem(newOps);
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
        opToRedeem.map((operation: RedeemOperation) => (
          <ClaimButton operation={operation} key={operation.inputOpId} />
        ))
      ) : (
        <p className="mas-menu-active text-info text-2xl">
          {Intl.t('claim.no-claim', { address: evmAddress })}
        </p>
      )}
    </div>
  );
}
