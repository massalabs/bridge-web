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

interface ClaimProps {
  claimStep: ClaimSteps;
  setClaimStep: (claimStep: ClaimSteps) => void;
}
// Renders when burn is successful, polls api to see if there is an operation to claim
// If operation found, renders claim button that calls redeem function

export function Claim({ claimStep, setClaimStep }: ClaimProps) {
  const { address: evmAddress, chain } = useAccount();
  const { selectedToken, refreshBalances } = useTokenStore();
  const { burn, setClaim, setBox } = useGlobalStatusesStore();
  const { burnTxId, amount, setClaimTxId } = useOperationStore();

  const { write, error, isSuccess, hash } = useClaim();

  const symbol = selectedToken?.symbolEVM as string;
  const selectedChain = chain?.name as string;

  const [signatures, setSignatures] = useState<string[]>([]);
  const [hasClickedClaimed, setHasClickedClaimed] = useState(false);

  const setLoadingToError = useCallback(() => {
    setClaim(Status.Error);
    setBox(Status.Error);
  }, [setClaim, setBox]);

  async function launchClaim() {
    setClaim(Status.Loading);
    if (!signatures.length) {
      setClaimStep(ClaimSteps.RetrievingInfo);
      const result = await handleClaimRedeem();
      return result;
    } else if (signatures) {
      return false;
    }
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
    // [] to prevent infinite loop
  }, []);

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
        setClaimStep(ClaimSteps.Reject);
      } else {
        setLoadingToError();
        setClaimStep(ClaimSteps.Error);
      }
    }
  }, [error, isSuccess, hash]);

  const handleClaimRedeem = useCallback(async (): Promise<boolean> => {
    if (!evmAddress || !burnTxId) return false;
    try {
      const operationToRedeem = await findClaimable(evmAddress, burnTxId);
      if (operationToRedeem) {
        setSignatures(sortSignatures(operationToRedeem.signatures));
        setClaimStep(ClaimSteps.AwaitingSignature);
        return true;
      }
    } catch (error: any) {
      console.error('Error fetching claim api', error.toString());
      toast.error(Intl.t('index.claim.error.unknown'));
      setLoadingToError();
    }
    return false;
  }, [evmAddress, burnTxId, setClaimStep, setLoadingToError]);

  async function _handleRedeem() {
    if (!amount || !evmAddress || !selectedToken || !burnTxId) return;

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
      signatures,
      recipient: evmAddress,
    });

    setClaimStep(ClaimSteps.Claiming);
  }

  const claimMessage =
    burn === Status.Success && !signatures.length ? (
      <div>
        {Intl.t('index.loading-box.claim-pending-1')}
        <br />
        {Intl.t('index.loading-box.claim-pending-2')}
      </div>
    ) : claimStep === ClaimSteps.Reject ? (
      <div className="text-s-error">
        {Intl.t('index.loading-box.rejected-by-user')}
      </div>
    ) : !hasClickedClaimed ? (
      Intl.t('index.loading-box.claim-message', {
        token: symbol,
        network: selectedChain,
      })
    ) : null;

  return (
    <div className="flex flex-col gap-6 justify-center">
      <div className="mas-body-2 text-center max-w-full">{claimMessage}</div>
      {signatures.length && !hasClickedClaimed ? (
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
