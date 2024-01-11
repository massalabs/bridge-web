import { useEffect } from 'react';

import { Button } from '@massalabs/react-ui-kit';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';

import { useAccountStore, useOperationStore } from '@/store/store';
import { checkIfUserHasTokensToClaim } from '@/utils/lambdaApi';

export function ClaimTokensPopup() {
  const [opToRedeem, setOpToRedeem] = useOperationStore((state) => [
    state.opToRedeem,
    state.setOpToRedeem,
  ]);
  const [connectedAccount] = useAccountStore((state) => [
    state.connectedAccount,
  ]);

  const { address: evmAddress } = useAccount();

  const massaAddress = connectedAccount?.address();

  const renderButton = opToRedeem && opToRedeem.length > 0;

  // TODO: Refactor so connectedAccount is initialized in store
  useEffect(() => {
    getApiInfo();
  }, [connectedAccount]);

  async function getApiInfo() {
    if (!massaAddress || !evmAddress) return;
    const pendingOperations = await checkIfUserHasTokensToClaim(
      massaAddress,
      evmAddress,
    );
    setOpToRedeem(pendingOperations);
  }

  function ClaimButton() {
    return (
      <div className="absolute top-36 right-12 bg-red-500 p-36">
        <Link to={'/claim'}>
          <Button>Claim</Button>
        </Link>
      </div>
    );
  }

  return <>{renderButton ? <ClaimButton /> : null}</>;
}