import { useState, SyntheticEvent, useEffect, useCallback } from 'react';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { BridgeRedeemLayout } from './Layouts/BridgeRedeemLayout/BridgeRedeemLayout';
import { PendingOperationLayout } from './Layouts/LoadingLayout/PendingOperationLayout';
import { ClaimTokensPopup } from '@/components/ClaimTokensPopup/ClaimTokensPopup';
import { TokensFAQ } from '@/components/FAQ/TokensFAQ';
import { BRIDGE_OFF, REDEEM_OFF } from '@/const/env/maintenance';
import { handleApproveRedeem } from '@/custom/bridge/handlers/handleApproveRedeem';
import { handleBurnRedeem } from '@/custom/bridge/handlers/handleBurnRedeem';
import { handleMintBridge } from '@/custom/bridge/handlers/handleMintBridge';
import {
  handleEvmApproveError,
  handleLockError,
} from '@/custom/bridge/handlers/handleTransactionErrors';
import { useEvmApprove } from '@/custom/bridge/useEvmApprove';
import useEvmToken from '@/custom/bridge/useEvmToken';
import { useLock } from '@/custom/bridge/useLock';
import { useNetworkCheck } from '@/custom/bridge/useNetworkCheck';
import Intl from '@/i18n/i18n';
import { Status } from '@/store/globalStatusesStore';
import {
  useAccountStore,
  useBridgeModeStore,
  useGlobalStatusesStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';
import { SIDE } from '@/utils/const';

export function Index() {
  const { massaClient, connectedAccount, isFetching } = useAccountStore();
  const { selectedToken } = useTokenStore();
  const { isMainnet } = useBridgeModeStore();
  const { side, setLockTxId, amount, setAmount, resetTxIDs } =
    useOperationStore();

  const { address: evmAddress } = useAccount();

  const { allowance: _allowanceEVM, tokenBalance: _tokenBalanceEVM } =
    useEvmToken();

  const [error, setError] = useState<{ amount: string } | null>(null);

  const [redeemSteps, setRedeemSteps] = useState<string>(
    Intl.t('index.loading-box.burn'),
  );

  const { box, setBox, setLock, setApprove, reset } = useGlobalStatusesStore();

  const { wrongNetwork } = useNetworkCheck();

  const {
    isSuccess: approveIsSuccess,
    error: approveError,
    write: writeEvmApprove,
  } = useEvmApprove();

  const {
    isSuccess: lockIsSuccess,
    write: writeLock,
    hash: lockHash,
    error: lockError,
  } = useLock();

  const massaToEvm = side === SIDE.MASSA_TO_EVM;

  const isOperationPending = box !== Status.None;
  const isBlurred = isOperationPending ? 'blur-md' : '';

  const isButtonDisabled =
    isFetching ||
    !connectedAccount ||
    wrongNetwork ||
    isMainnet ||
    (BRIDGE_OFF && !massaToEvm) ||
    (REDEEM_OFF && massaToEvm);

  useEffect(() => {
    setError({ amount: '' });
  }, [amount, side, selectedToken?.name]);

  useEffect(() => {
    if (lockIsSuccess) {
      setLock(Status.Success);
      if (!lockHash) return;
      // Set lock id
      setLockTxId(lockHash);
      if (!massaClient) return;
      handleMintBridge();
    }
    if (lockError) {
      handleLockError(lockError);
      setBox(Status.Error);
      setLock(Status.Error);
    }
  }, [
    lockIsSuccess,
    lockError,
    lockHash,
    massaClient,
    setLock,
    setBox,
    setLockTxId,
  ]);

  useEffect(() => {
    if (approveIsSuccess) {
      setApprove(Status.Success);
      if (!amount) return;
      setLock(Status.Loading);
      writeLock();
    }
    if (approveError) {
      handleEvmApproveError(approveError);
      setBox(Status.Error);
      setApprove(Status.Error);
    }
  }, [
    approveIsSuccess,
    approveError,
    amount,
    setApprove,
    setLock,
    setBox,
    writeLock,
  ]);

  const closeLoadingBox = useCallback(() => {
    reset();
    setAmount();
    // Reset all transaction id's
    resetTxIDs();
  }, [reset, setAmount, resetTxIDs]);

  useEffect(() => {
    if (box === Status.None) closeLoadingBox();
  }, [box, closeLoadingBox]);

  function validate() {
    setError(null);

    if (!amount || !selectedToken) {
      setError({ amount: Intl.t('index.approve.error.invalid-amount') });
      return false;
    }

    const _amount = parseUnits(amount, selectedToken.decimals);
    let _balance;

    if (massaToEvm) {
      _balance = selectedToken?.balance || 0n;
    } else {
      _balance = _tokenBalanceEVM;
    }

    if (_amount <= 0n) {
      setError({ amount: Intl.t('index.approve.error.invalid-amount') });
      return false;
    }

    if (_balance < _amount) {
      setError({ amount: Intl.t('index.approve.error.insufficient-funds') });
      return false;
    }

    return true;
  }

  // TODO: refactor this
  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (!validate() || !amount) return;
    setBox(Status.Loading);

    if (massaToEvm) {
      if (!massaClient) {
        return;
      }
      const approved = await handleApproveRedeem(amount);

      if (approved) {
        if (!evmAddress) {
          return;
        }

        await handleBurnRedeem({
          recipient: evmAddress,
          amount,
          setRedeemSteps,
        });
      }
    } else {
      if (!selectedToken) {
        return;
      }
      setApprove(Status.Loading);
      let _amount = parseUnits(amount, selectedToken.decimals);
      const needApproval = _allowanceEVM < _amount;

      if (needApproval) {
        writeEvmApprove?.();
        return;
      }
      setApprove(Status.Success);
      setLock(Status.Loading);
      writeLock?.();
    }
  }

  return (
    <div className="flex flex-col gap-36 items-center justify-center w-full h-full min-h-screen">
      {/* If loading -> show loading layout else show home page*/}
      {isOperationPending ? (
        <PendingOperationLayout
          onClose={closeLoadingBox}
          redeemSteps={redeemSteps}
        />
      ) : (
        <BridgeRedeemLayout
          isBlurred={isBlurred}
          isButtonDisabled={isButtonDisabled}
          error={error}
          setError={setError}
          handleSubmit={handleSubmit}
        />
      )}

      <TokensFAQ />
      {!isOperationPending && <ClaimTokensPopup />}
    </div>
  );
}
