import { useState, SyntheticEvent, useEffect, useCallback } from 'react';
import {
  Button,
  PopupModal,
  PopupModalContent,
  PopupModalHeader,
} from '@massalabs/react-ui-kit';
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
import { validate } from '@/custom/bridge/handlers/validateTransaction';
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

export function Index() {
  const { massaClient, connectedAccount, isFetching } = useAccountStore();
  const { selectedToken } = useTokenStore();
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const { side, setLockTxId, amount, setAmount, resetTxIDs, isMassaToEvm } =
    useOperationStore();

  const massaToEvm = isMassaToEvm();

  const { address: evmAddress } = useAccount();

  const { allowance: _allowanceEVM, tokenBalance: _tokenBalanceEVM } =
    useEvmToken();

  const [redeemLabel, setRedeemLabel] = useState<string>( // TODO later: see if we need that
    Intl.t('index.loading-box.burn'),
  );

  const { box, setBox, setLock, setApprove, reset, setAmountError } =
    useGlobalStatusesStore();

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

  const isOperationPending = box !== Status.None;
  const isBlurred = isOperationPending ? 'blur-md' : '';
  const isMainnet = getIsMainnet();

  const isButtonDisabled =
    isFetching ||
    !connectedAccount ||
    wrongNetwork ||
    isMainnet ||
    (BRIDGE_OFF && !massaToEvm) ||
    (REDEEM_OFF && massaToEvm);

  useEffect(() => {
    setAmountError('');
  }, [amount, side, selectedToken?.name, setAmountError]);

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

  // TODO: refactor this
  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    // validate amount to transact
    if (!validate(_tokenBalanceEVM) || !amount) return;
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
          setRedeemLabel,
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
          redeemLabel={redeemLabel}
        />
      ) : (
        <BridgeRedeemLayout
          isBlurred={isBlurred}
          isButtonDisabled={isButtonDisabled}
          handleSubmit={handleSubmit}
        />
      )}

      <TokensFAQ />
      {!isOperationPending && <ClaimTokensPopup />}

      <PopupModal
        customClass="flex justify-center text-s-info"
        customClassNested="w-1/2 py-10"
        fullMode={true}
      >
        <PopupModalContent>
          <div className=" flex flex-col justify-center gap-4">
            <div className="mas-title">Accept the Terms of Service</div>
            <a href="https://bridge.massa.net/legal/ToS.pdf" target="_blank">
              <u>Terms of service</u>
            </a>
            <Button>Accept</Button>
          </div>
        </PopupModalContent>
      </PopupModal>
    </div>
  );
}
