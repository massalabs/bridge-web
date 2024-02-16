import { useCallback, useEffect } from 'react';
import { Button, toast } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { handleEvmClaimBoxError } from '@/custom/bridge/handlers/handleTransactionErrors';
import { useClaim } from '@/custom/bridge/useClaim';
import Intl from '@/i18n/i18n';
import { Status } from '@/store/globalStatusesStore';
import { RedeemOperation } from '@/store/operationStore';
import {
  useGlobalStatusesStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';
import { ClaimState } from '@/utils/const';
import { findClaimable } from '@/utils/lambdaApi';

// Renders when burn is successful, polls api to see if there is an operation to claim
// If operation found, renders claim button that calls redeem function

export function ClaimRedeem() {
  const { address: evmAddress, chain } = useAccount();
  const { selectedToken, refreshBalances } = useTokenStore();
  const { burn, setClaim, setBox } = useGlobalStatusesStore();
  const {
    burnTxId,
    amount,
    getCurrentRedeemOperation,
    updateOpToRedeemByInputOpId,
  } = useOperationStore();

  const { write, error, isSuccess, hash, isPending } = useClaim();

  const currentRedeemOperation = getCurrentRedeemOperation();
  const symbol = selectedToken?.symbolEVM as string;
  const selectedChain = chain?.name as string;

  const updateCurrentRedeemOperation = useCallback(
    (op: Partial<RedeemOperation>) => {
      if (!burnTxId) return;
      updateOpToRedeemByInputOpId(burnTxId, op);
    },
    [burnTxId, updateOpToRedeemByInputOpId],
  );

  const setLoadingToError = useCallback(() => {
    setClaim(Status.Error);
    setBox(Status.Error);
  }, [setClaim, setBox]);

  useEffect(() => {
    if (isPending) {
      updateCurrentRedeemOperation({
        claimState: ClaimState.PENDING,
      });
    }
    if (isSuccess && hash) {
      updateCurrentRedeemOperation({
        claimState: ClaimState.SUCCESS,
        outputTxId: hash,
      });
      setClaim(Status.Success);
      setBox(Status.Success);
      refreshBalances();
    }
    if (error) {
      const state = handleEvmClaimBoxError(error);
      if (state === ClaimState.REJECTED) {
        setClaim(Status.Error);
        updateCurrentRedeemOperation({
          claimState: ClaimState.REJECTED,
        });
      } else {
        setLoadingToError();
        updateCurrentRedeemOperation({
          claimState: ClaimState.ERROR,
        });
      }
    }
  }, [
    isPending,
    error,
    isSuccess,
    hash,
    setBox,
    refreshBalances,
    setClaim,
    updateCurrentRedeemOperation,
    setLoadingToError,
  ]);

  useEffect(() => {
    if (burn === Status.Success && !currentRedeemOperation?.signatures.length) {
      const launchClaim = async () => {
        if (
          burn === Status.Success &&
          !currentRedeemOperation?.signatures.length &&
          evmAddress &&
          burnTxId
        ) {
          try {
            const operationToRedeem = await findClaimable(evmAddress, burnTxId);
            if (operationToRedeem) {
              updateCurrentRedeemOperation({
                signatures: operationToRedeem.signatures.map(
                  (s) => s.signature,
                ),
              });
              updateCurrentRedeemOperation({
                claimState: ClaimState.READY_TO_CLAIM,
              });
              return;
            }
          } catch (error: any) {
            console.error('Error fetching claim api', error.toString());
            toast.error(Intl.t('index.claim.error.unknown'));
            setLoadingToError();
          }
          setTimeout(launchClaim, 1000);
        }
      };
      launchClaim();
    }
  }, [
    burn,
    currentRedeemOperation,
    evmAddress,
    burnTxId,
    setLoadingToError,
    updateCurrentRedeemOperation,
  ]);

  async function handleRedeem() {
    if (
      !amount ||
      !evmAddress ||
      !selectedToken ||
      !burnTxId ||
      !currentRedeemOperation ||
      currentRedeemOperation.signatures.length === 0
    )
      return;

    setClaim(Status.Loading);
    updateCurrentRedeemOperation({
      claimState: ClaimState.AWAITING_SIGNATURE,
    });
    write({
      amount: parseUnits(amount, selectedToken.decimals).toString(),
      evmToken: selectedToken.evmToken as `0x${string}`,
      inputOpId: burnTxId,
      signatures: currentRedeemOperation.signatures,
      recipient: evmAddress,
    });
  }

  const isRetrievingInformation =
    currentRedeemOperation?.claimState === ClaimState.RETRIEVING_INFO;
  const isClaimRejected =
    currentRedeemOperation?.claimState === ClaimState.REJECTED;
  const isClaimAwaitingSignature =
    currentRedeemOperation?.claimState === ClaimState.AWAITING_SIGNATURE ||
    currentRedeemOperation?.claimState === ClaimState.READY_TO_CLAIM;

  const claimMessage = isRetrievingInformation ? (
    <div>
      {Intl.t('index.loading-box.retrieving-claim-info-1')}
      <br />
      {Intl.t('index.loading-box.retrieving-claim-info-2')}
    </div>
  ) : isClaimRejected ? (
    <div className="text-s-error">
      {Intl.t('index.loading-box.rejected-by-user')}
    </div>
  ) : isClaimAwaitingSignature ? (
    Intl.t('index.loading-box.claim-message', {
      token: symbol,
      network: selectedChain,
    })
  ) : null;

  return (
    <div className="flex flex-col gap-6 justify-center">
      <div className="mas-body-2 text-center max-w-full">{claimMessage}</div>
      {isClaimAwaitingSignature ? (
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
