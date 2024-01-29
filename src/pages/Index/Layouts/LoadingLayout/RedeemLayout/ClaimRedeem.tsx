import { useEffect, useState } from 'react';

import { Button, toast } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';
import { useAccount, useNetwork } from 'wagmi';

import { ClaimSteps } from './RedeemLayout';
import {
  endPoint,
  getBurnedByEvmAddress,
} from '../../../../../utils/lambdaApi';
import { checkBurnedOpForRedeem } from '@/custom/bridge/handlers/checkBurnedOpForRedeem';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
import Intl from '@/i18n/i18n';
import { Status } from '@/store/globalStatusesStore';
import {
  useBridgeModeStore,
  useGlobalStatusesStore,
  useTokenStore,
} from '@/store/store';
import { CustomError, isRejectedByUser } from '@/utils/error';

interface ClaimProps {
  setClaimStep: (claimStep: ClaimSteps) => void;
  operationId: string;
  amount: string;
  decimals: number;
}
// Renders when burn is successful, polls api to see if there is an operation to claim
// If operation found, renders claim button that calls redeem function

export function Claim({
  setClaimStep,
  operationId,
  amount,
  decimals,
}: ClaimProps) {
  const { address: evmAddress } = useAccount();

  const { selectedToken } = useTokenStore();
  const { currentMode } = useBridgeModeStore();
  const { handleRedeem: _handleRedeemEVM } = useEvmBridge();
  const { chain } = useNetwork();
  const { burn, setClaim, setBox } = useGlobalStatusesStore();

  const symbol = selectedToken?.symbol as string;
  const selectedChain = chain?.name as string;

  const [isReadyToClaim, setIsReadyToClaim] = useState(false);
  const [signatures, setSignatures] = useState<string[]>([]);
  const [hasClickedClaimed, setHasClickedClaimed] = useState(false);

  // Polls every 3 seconds to see if conditions are met to show claim

  // TODO: determine if we need a timeout here
  useEffect(() => {
    setClaim(Status.Loading);
    if (burn === Status.Success && !isReadyToClaim) {
      setClaimStep(ClaimSteps.RetrievingInfo);
      const timer = setInterval(() => {
        _handleClaimRedeem();
      }, 3000);
      return () => clearInterval(timer);
    }
    if (isReadyToClaim) {
      setClaimStep(ClaimSteps.AwaitingSignature);
    }
  }, [burn, isReadyToClaim]);

  async function _handleClaimRedeem(): Promise<boolean> {
    if (!evmAddress) return false;
    try {
      const burnedOpList = await getBurnedByEvmAddress(
        currentMode,
        evmAddress,
        endPoint,
      );

      const claimArgs = {
        burnedOpList,
        operationId,
      };

      // Returns signatures sorted by relayerId
      const signatures = checkBurnedOpForRedeem(claimArgs);

      if (signatures.length > 0) {
        setClaimStep(ClaimSteps.AwaitingSignature);
        setSignatures(signatures);
        setIsReadyToClaim(true);
      }
      return true;
    } catch (error: any) {
      handleGetAPiErrors(error);
      return false;
    }
  }

  function handleGetAPiErrors(error: any) {
    console.log('Error fetching claim api', error.toString());
    toast.error(Intl.t('index.claim.error.unknown'));
    setLoadingToError();
  }

  function setLoadingToError() {
    setClaim(Status.Error);
    setBox(Status.Error);
  }

  async function _handleRedeem() {
    if (!evmAddress || !selectedToken) return;
    try {
      if (hasClickedClaimed) {
        toast.error(Intl.t('index.loading-box.claim-error-1'));
        return;
      }

      setHasClickedClaimed(true);
      const evmRedeem = await _handleRedeemEVM(
        parseUnits(amount, decimals).toString(),
        evmAddress,
        selectedToken.evmToken as `0x${string}`,
        operationId,
        signatures,
      );

      if (evmRedeem) {
        setClaimStep(ClaimSteps.Claiming);
      }
    } catch (error) {
      handleClaimError(error);
    }
  }

  // handlesEvmRedeemErrors
  function handleClaimError(error: undefined | unknown) {
    const typedError = error as CustomError;

    if (isRejectedByUser(typedError)) {
      toast.error(Intl.t('index.claim.error.rejected'));
      setLoadingToError();
      setClaimStep(ClaimSteps.Reject);
    } else {
      toast.error(Intl.t('index.claim.error.unknown'));
      setLoadingToError();
      setClaimStep(ClaimSteps.Error);
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col gap-6 justify-center">
      <div className="mas-body-2 text-center max-w-full">
        {burn === Status.Success && !isReadyToClaim ? (
          <div>
            {Intl.t('index.loading-box.claim-pending-1')}
            <br />
            {Intl.t('index.loading-box.claim-pending-2')}
          </div>
        ) : (
          Intl.t('index.loading-box.claim-message', {
            token: symbol,
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
          {Intl.t('index.loading-box.claim')} {symbol}
        </Button>
      ) : null}
    </div>
  );
}
