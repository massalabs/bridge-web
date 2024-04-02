import { useCallback, useEffect } from 'react';
import { Button } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { config } from '@/const';
import { useResource } from '@/custom/api/useResource';
import { handleEvmClaimBoxError } from '@/custom/bridge/handlers/handleTransactionErrors';
import { useClaim } from '@/custom/bridge/useClaim';
import Intl from '@/i18n/i18n';
import { Status } from '@/store/globalStatusesStore';
import { BurnRedeemOperation } from '@/store/operationStore';
import {
  useBridgeModeStore,
  useGlobalStatusesStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';
import { ClaimState } from '@/utils/const';
import {
  Entities,
  OperationHistoryItem,
  burnOpApiToDTO,
  lambdaEndpoint,
  useFetchSignatures,
} from '@/utils/lambdaApi';

// Renders when burn is successful, polls api to see if there is an operation to claim
// If operation found, renders claim button that calls redeem function
export function ClaimRedeem() {
  const { address: evmAddress, chain } = useAccount();
  const { selectedToken, refreshBalances } = useTokenStore();
  const { setClaim, setBox } = useGlobalStatusesStore();
  const {
    burnTxId,
    amount,
    getCurrentRedeemOperation,
    updateBurnRedeemOperationById,
  } = useOperationStore();

  useFetchSignatures();

  const { write, error, isSuccess, hash, isPending } = useClaim();

  useCloseLoadingBoxOnSuccess();

  const currentRedeemOperation = getCurrentRedeemOperation();

  const updateCurrentRedeemOperation = useCallback(
    (op: Partial<BurnRedeemOperation>) => {
      if (!burnTxId) return;
      updateBurnRedeemOperationById(burnTxId, op);
    },
    [burnTxId, updateBurnRedeemOperationById],
  );

  const setLoadingToError = useCallback(() => {
    setClaim(Status.Error);
    setBox(Status.Error);
  }, [setClaim, setBox]);

  // Updates current redeem operation state based on claim status
  useEffect(() => {
    if (isPending) {
      updateCurrentRedeemOperation({
        claimState: ClaimState.PENDING,
      });
    } else if (isSuccess && hash) {
      updateCurrentRedeemOperation({
        claimState: ClaimState.SUCCESS,
        outputId: hash,
      });
      setClaim(Status.Success);
      setBox(Status.Success);
      refreshBalances();
    } else if (error) {
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

  // Event handler for claim button
  async function handleRedeem() {
    if (
      !amount ||
      !evmAddress ||
      !selectedToken ||
      !burnTxId ||
      !currentRedeemOperation ||
      !currentRedeemOperation.signatures ||
      currentRedeemOperation.signatures?.length === 0
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

  const symbol = selectedToken?.symbolEVM as string;
  const selectedChain = chain?.name as string;

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
      {isClaimAwaitingSignature || isClaimRejected ? (
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

export function useCloseLoadingBoxOnSuccess() {
  const { address: evmAddress } = useAccount();
  const { burnTxId } = useOperationStore();
  const { setBox } = useGlobalStatusesStore();
  const { currentMode } = useBridgeModeStore();

  const queryParams = `?evmAddress=${evmAddress}&inputOpId=${burnTxId}&entities=${Entities.Burn}`;
  const lambdaUrl = `${config[currentMode].lambdaUrl}${lambdaEndpoint}${queryParams}`;

  const { data: burnOperations } =
    useResource<OperationHistoryItem[]>(lambdaUrl);

  // Close the loading box if the operation is already claimed in the claim page
  useEffect(() => {
    if (burnOperations?.length) {
      const op = burnOpApiToDTO(burnOperations[0]);
      if (op && op.claimState === ClaimState.SUCCESS) {
        setBox(Status.None);
      }
    }
  }, [burnOperations, setBox]);
}
