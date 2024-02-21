import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ClaimButton } from './ClaimButton';
import Intl from '@/i18n/i18n';
import { BurnRedeemOperation } from '@/store/operationStore';
import { useOperationStore } from '@/store/store';
import { getClaimableOperations } from '@/utils/lambdaApi';

export function ClaimPage() {
  const { burnRedeemOperations, setBurnRedeemOperations } = useOperationStore();
  const { address: evmAddress } = useAccount();

  useEffect(() => {
    if (!evmAddress) return;
    getClaimableOperations(evmAddress).then((newOps) => {
      setBurnRedeemOperations(newOps);
    });
  }, [evmAddress, setBurnRedeemOperations]);

  const burnListIsNotEmpty = burnRedeemOperations.length;

  if (!evmAddress) {
    console.warn('EVM address not found');
    return null;
  }

  return (
    <div className="flex flex-col w-fit px-40 items-center justify-center gap-6 overflow-scroll">
      {burnListIsNotEmpty ? (
        burnRedeemOperations.map((operation: BurnRedeemOperation) => (
          <ClaimButton operation={operation} key={operation.inputId} />
        ))
      ) : (
        <p className="mas-menu-active text-info text-2xl">
          {Intl.t('claim.no-claim', { address: evmAddress })}
        </p>
      )}
    </div>
  );
}
