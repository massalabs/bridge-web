import { useEffect, useState } from 'react';

import { Button, toast } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';
import { useAccount, useNetwork } from 'wagmi';

import { endPoint, getBurnedOperationInfo, Signatures } from './lambdaApi';
import { ClaimSteps } from './RedeemLayout';
import { LoadingState } from '@/const';
import { checkBurnedOpForRedeem } from '@/custom/bridge/handlers/checkBurnedOpForRedeem';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';

interface ClaimProps {
  loading: LoadingState;
  setClaimStep: (claimStep: ClaimSteps) => void;
  setLoading: (loading: LoadingState) => void;
  operationId: string;
  amount: string;
  decimals: number;
}
// Renders when burn is successful, polls api to see if there is an operation to claim
// If operation found, renders claim button that calls redeem function

export function Claim({
  loading,
  setClaimStep,
  setLoading,
  operationId,
  amount,
  decimals,
}: ClaimProps) {
  const { address: evmAddress } = useAccount();
  const [connectedAccount, token] = useAccountStore((state) => [
    state.connectedAccount,
    state.token,
  ]);
  const { handleRedeem: _handleRedeemEVM } = useEvmBridge();
  const { chain } = useNetwork();

  const selectedToken = token?.symbol as string;
  const selectedChain = chain?.name as string;

  const [isReadyToClaim, setIsReadyToClaim] = useState(false);
  const [signatures, setSignatures] = useState<string[]>([]);
  const [hasClickedClaimed, setHasClickedClaimed] = useState(false);

  const massaAddress = connectedAccount?.address();

  // Polls every 3 seconds to see if conditions are met to show claim
  // TODO: determine if we need a timeout here
  useEffect(() => {
    setLoading({ claim: 'loading' });
    if (loading.burn === 'success' && !isReadyToClaim) {
      setClaimStep(ClaimSteps.RetrievingInfo);
      const timer = setInterval(() => {
        _handleClaimRedeem();
      }, 3000);
      return () => clearInterval(timer);
    }
    if (isReadyToClaim) {
      setClaimStep(ClaimSteps.AwaitingSignature);
    }
  }, [loading.burn, isReadyToClaim]);

  async function _handleClaimRedeem() {
    if (!evmAddress || !massaAddress) return;

    const burnedOpList = await getBurnedOperationInfo(
      evmAddress,
      massaAddress,
      endPoint,
    );

    const claimArgs = {
      burnedOpList,
      operationId,
    };

    // Returns signatures sorted by relayerId
    const signatures = checkBurnedOpForRedeem(claimArgs);

    if (signatures.length > 0) {
      const convertedSignatures: string[] = [];

      signatures.forEach((signature: Signatures) => {
        convertedSignatures.push(signature.signature);
      });

      setClaimStep(ClaimSteps.AwaitingSignature);
      setSignatures(convertedSignatures);
      setIsReadyToClaim(true);
    }
  }

  async function _handleRedeem() {
    if (hasClickedClaimed) {
      toast.error(Intl.t('index.loading-box.claim-error-1'));
      return;
    }

    setHasClickedClaimed(true);

    const evmRedeem = await _handleRedeemEVM(
      parseUnits(amount, decimals),
      evmAddress as `0x${string}`,
      operationId,
      signatures,
    );

    if (evmRedeem) {
      setClaimStep(ClaimSteps.Claiming);
    } else if (!evmRedeem) {
      setHasClickedClaimed(false);
      // TODO: add correct error flow
      toast.error('something was wrong or user rejected');
    }
  }

  return (
    <div className="flex flex-col gap-6 justify-center">
      <div className="mas-body-2 text-center max-w-full">
        {loading.burn === 'success' && !isReadyToClaim ? (
          <div>
            {Intl.t('index.loading-box.claim-pending-1')}
            <br />
            {Intl.t('index.loading-box.claim-pending-2')}
          </div>
        ) : (
          Intl.t('index.loading-box.claim-message', {
            token: selectedToken,
            network: selectedChain,
          })
        )}
      </div>
      {isReadyToClaim && !hasClickedClaimed ? (
        <Button
          onClick={() => {
            _handleRedeem();
          }}
        >
          {Intl.t('index.loading-box.claim')} {selectedToken}
        </Button>
      ) : null}
    </div>
  );
}
