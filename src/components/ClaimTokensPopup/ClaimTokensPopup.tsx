import { useEffect } from 'react';

import { Button } from '@massalabs/react-ui-kit';
import { Link } from 'react-router-dom';
import { useAccount, useNetwork } from 'wagmi';

import Intl from '@/i18n/i18n';
import { useAccountStore, useOperationStore } from '@/store/store';
import { checkIfUserHasTokensToClaim } from '@/utils/lambdaApi';

export function ClaimTokensPopup() {
  const [opToRedeem, setOpToRedeem] = useOperationStore((state) => [
    state.opToRedeem,
    state.setOpToRedeem,
  ]);
  const [getConnectedAddress] = useAccountStore((state) => [
    state.getConnectedAddress,
  ]);

  const { address: evmAddress } = useAccount();

  const massaAddress = getConnectedAddress();

  const renderButton = opToRedeem && opToRedeem.length > 0;
  useEffect(() => {
    getApiInfo();
  }, [massaAddress]);

  async function getApiInfo() {
    if (!massaAddress || !evmAddress) return;
    const pendingOperations = await checkIfUserHasTokensToClaim(
      massaAddress,
      evmAddress,
    );
    setOpToRedeem(pendingOperations);
  }

  const { chain: evmConnectedChain } = useNetwork();

  function ClaimButton() {
    return (
      <div
        className="flex flex-col gap-4 h-fit w-72 absolute top-32 right-12
        border border-tertiary 
        bg-secondary/50 backdrop-blur-lg text-f-primary rounded-2xl p-10"
      >
        <p className="mas-menu-active">{Intl.t('claim.popup-title')}</p>
        <p>
          {Intl.t('claim.popup-description', {
            chain: evmConnectedChain?.name as string,
          })}
        </p>
        <Link to={'/claim'}>
          <Button>{Intl.t('claim.claim')}</Button>
        </Link>
      </div>
    );
  }

  return <>{renderButton ? <ClaimButton /> : null}</>;
}
