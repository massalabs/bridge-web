import { useEffect } from 'react';

import { useAccount } from 'wagmi';

import { ClaimButton } from './ClaimButton';
import Intl from '@/i18n/i18n';
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

  const { address: evmAddress } = useAccount();

  useEffect(() => {
    getApiInfo();
  }, [connectedAccount, evmAddress]);

  async function getApiInfo() {
    if (!connectedAccount || !evmAddress) return;

    const pendingOperations = await checkIfUserHasTokensToClaim(
      connectedAccount.address(),
      evmAddress,
    );
    setOpToRedeem(pendingOperations);
  }

  const burnListIsNotEmpty = opToRedeem.length;

  return (
    <div className="flex flex-col w-full items-center justify-center h-[60vh] gap-6">
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
          {Intl.t('claim.no-claim')}
        </p>
      )}
    </div>
  );
}
