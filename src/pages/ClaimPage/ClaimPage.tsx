import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ClaimButton } from './ClaimButton';
import Intl from '@/i18n/i18n';
import { BurnRedeemOperation } from '@/store/operationStore';
import { useOperationStore } from '@/store/store';
import { getClaimableOperations } from '@/utils/lambdaApi';

export function ClaimPage() {
  const { burnRedeemOperations, setBurnRedeemOperations } = useOperationStore();
  const { address: evmAddress } = useAccount();

  // Keep the list of operation IDs to claim in the first call to getRedeemOperation,
  // to be able to see only the success state of them, and not the whole list of previous success operations.
  const [redeemableOperationIds, setRedeemableOperationIds] = useState<
    string[]
  >([]);

  useEffect(() => {
    if (!evmAddress) return;
    getClaimableOperations(evmAddress).then((newOps) => {
      setBurnRedeemOperations(newOps);
      if (!redeemableOperationIds.length && newOps.length) {
        setRedeemableOperationIds(newOps.map((op) => op.inputId));
      }
    });
  }, [
    evmAddress,
    redeemableOperationIds,
    setRedeemableOperationIds,
    setBurnRedeemOperations,
  ]);

  const burnOperations = burnRedeemOperations.filter((op) =>
    redeemableOperationIds.includes(op.inputId),
  );
  const burnListIsNotEmpty = burnOperations.length;

  if (!evmAddress) {
    console.warn('EVM address not found');
    return null;
  }

  return (
    <div className="flex flex-col w-fit px-40 items-center justify-center gap-6 overflow-scroll">
      {burnListIsNotEmpty ? (
        burnOperations.map((operation: BurnRedeemOperation) => (
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
