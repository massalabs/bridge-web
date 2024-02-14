import { useCallback, useEffect, useState } from 'react';
import { Button, toast } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { ClaimSteps } from './RedeemLayout';
import { ClaimState } from '../../../../ClaimPage/ClaimButton';
import { handleEvmClaimBoxError } from '@/custom/bridge/handlers/handleTransactionErrors';
import { useClaim } from '@/custom/bridge/useClaim';
import Intl from '@/i18n/i18n';
import { Status } from '@/store/globalStatusesStore';
import {
  useGlobalStatusesStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';
import { findClaimable, sortSignatures } from '@/utils/lambdaApi';

// Renders when burn is successful, polls api to see if there is an operation to claim
// If operation found, renders claim button that calls redeem function

export function Claim() {
  const { address: evmAddress, chain } = useAccount();
  const { selectedToken, refreshBalances } = useTokenStore();
  const { burn, setClaim, setBox } = useGlobalStatusesStore();
  const {
    burnTxId,
    amount,
    setClaimTxId,
    currentRedeemOperation,
    updateCurrentRedeemOperation,
  } = useOperationStore();

  const { write, error, isSuccess, hash } = useClaim();

  const symbol = selectedToken?.symbolEVM as string;
  const selectedChain = chain?.name as string;

  const [hasClickedClaimed, setHasClickedClaimed] = useState(false);

  const setLoadingToError = useCallback(() => {
    setClaim(Status.Error);
    setBox(Status.Error);
  }, [setClaim, setBox]);

  async function launchClaim() {
    setClaim(Status.Loading);
    if (!currentRedeemOperation?.signatures.length) {
      updateCurrentRedeemOperation({
        claimStep: ClaimSteps.RetrievingInfo,
      });
      return await handleClaimRedeem();
    }
    return false;
  }

  useEffect(() => {
    if (burn !== Status.Success) return;
    const launchClaimWithRetry = async () => {
      let result = await launchClaim();
      while (!result) {
        result = await launchClaim();
      }
    };
    launchClaimWithRetry();
    // [] to render only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // maybe no need for a useEffect here
  useEffect(() => {
    if (isSuccess && hash) {
      setClaimTxId(hash);
      setClaim(Status.Success);
      setBox(Status.Success);
      refreshBalances();
    }
    if (error) {
      const state = handleEvmClaimBoxError(error);
      if (state === ClaimState.REJECTED) {
        setClaim(Status.Error);
        setHasClickedClaimed(false);
        updateCurrentRedeemOperation({
          claimStep: ClaimSteps.Reject,
        });
      } else {
        setLoadingToError();
        updateCurrentRedeemOperation({
          claimStep: ClaimSteps.Error,
        });
      }
    }
  }, [
    error,
    isSuccess,
    hash,
    setBox,
    refreshBalances,
    setClaim,
    setHasClickedClaimed,
    updateCurrentRedeemOperation,
    setLoadingToError,
    setClaimTxId,
  ]);

  async function handleClaimRedeem(): Promise<boolean> {
    if (!evmAddress || !burnTxId) return false;
    try {
      const operationToRedeem = await findClaimable(evmAddress, burnTxId);
      if (operationToRedeem) {
        const signatures = sortSignatures(operationToRedeem.signatures);
        updateCurrentRedeemOperation({
          signatures: signatures,
        });
        updateCurrentRedeemOperation({
          claimStep: ClaimSteps.AwaitingSignature,
        });
      }
    } catch (error: any) {
      console.error('Error fetching claim api', error.toString());
      toast.error(Intl.t('index.claim.error.unknown'));
      setLoadingToError();
    }
    return false;
  }

  async function handleRedeem() {
    if (!amount || !evmAddress || !selectedToken || !burnTxId || !currentRedeemOperation || 
      currentRedeemOperation.signatures.length === 0) return;

    if (hasClickedClaimed) {
      toast.error(Intl.t('index.loading-box.claim-error-1'));
      return;
    }

    setClaim(Status.Loading);
    setHasClickedClaimed(true);
    write({
      amount: parseUnits(amount, selectedToken.decimals).toString(),
      evmToken: selectedToken.evmToken as `0x${string}`,
      inputOpId: burnTxId,
      signatures: currentRedeemOperation.signatures,
      recipient: evmAddress,
    });

    updateCurrentRedeemOperation({
      claimStep: ClaimSteps.Claiming,
    });
  }

  const isClaimPending = burn === Status.Success && !currentRedeemOperation?.signatures.length;

  const isClaimRejected = currentRedeemOperation?.claimStep === ClaimSteps.Reject;

  const claimMessage = isClaimPending ? (
    <div>
      {Intl.t('index.loading-box.claim-pending-1')}
      <br />
      {Intl.t('index.loading-box.claim-pending-2')}
    </div>
  ) : isClaimRejected ? (
    <div className="text-s-error">
      {Intl.t('index.loading-box.rejected-by-user')}
    </div>
  ) : !hasClickedClaimed ? (
    Intl.t('index.loading-box.claim-message', {
      token: symbol,
      network: selectedChain,
    })
  ) : null;

  const isReadyToClaim = currentRedeemOperation?.signatures.length && !hasClickedClaimed;

  return (
    <div className="flex flex-col gap-6 justify-center">
      <div className="mas-body-2 text-center max-w-full">{claimMessage}</div>
      {isReadyToClaim ? (
        <Button
          onClick={() => {
            handleRedeem();
          }}
        >
          {Intl.t('index.loading-box.claim')} {symbol}
        </Button>
      ) : null}
    </div>
  );
}
