import { useEffect, useState } from 'react';
import { Button } from '@massalabs/react-ui-kit';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import Intl from '@/i18n/i18n';
import { useBridgeModeStore } from '@/store/store';
import { getClaimableOperations } from '@/utils/lambdaApi';

export function ClaimTokensPopup() {
  const { address: evmAddress, chain: evmConnectedChain } = useAccount();
  const { currentMode } = useBridgeModeStore();

  const [renderButton, setRenderButton] = useState(false);

  useEffect(() => {
    if (!evmAddress) return;
    getClaimableOperations(evmAddress).then((pendingOperations) => {
      setRenderButton(!!pendingOperations.length);
    });
  }, [evmAddress, currentMode]);

  function ClaimButton() {
    const evmChainName = evmConnectedChain?.name;
    if (!evmChainName) return null;
    return (
      <div
        className="flex flex-col gap-4 h-fit w-72 absolute top-48 right-12
        border border-tertiary 
        bg-secondary/50 backdrop-blur-lg text-f-primary rounded-2xl p-10"
      >
        <p className="mas-menu-active">{Intl.t('claim.popup-title')}</p>
        <p>
          {Intl.t('claim.popup-description', {
            chain: evmChainName,
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
