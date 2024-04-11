import { useEffect } from 'react';
import { BridgeRedeemLayout } from './Layouts/BridgeRedeemLayout/BridgeRedeemLayout';

import { ClaimTokensPopup } from '@/components/ClaimTokensPopup/ClaimTokensPopup';
import { BRIDGE_OFF, REDEEM_OFF } from '@/const/env/maintenance';
import { useBridgeUtils } from '@/custom/bridge/useBridgeUtils';
import {
  ChainContext,
  useEvmChainValidation,
  useMassaNetworkValidation,
} from '@/custom/bridge/useNetworkValidation';
import { Status } from '@/store/globalStatusesStore';
import {
  useAccountStore,
  useGlobalStatusesStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';

export function IndexPage() {
  const { connectedAccount, isFetching } = useAccountStore();
  const { selectedToken } = useTokenStore();
  const { side, amount, setAmount, resetTxIDs, isMassaToEvm } =
    useOperationStore();

  const massaToEvm = isMassaToEvm();
  const isValidEthNetwork = useEvmChainValidation(ChainContext.BRIDGE);
  const isValidMassaNetwork = useMassaNetworkValidation();

  const {
    write: writeEvmApprove,
    isSuccess: approveSuccess,
    error: approveError,
  } = useEvmApprove();

  const { write: writeLock } = useLock();

  const isOperationPending = box !== Status.None;
  const isBlurred = isOperationPending ? 'blur-md' : '';

  const isButtonDisabled =
    isFetching ||
    !connectedAccount ||
    !isValidEthNetwork ||
    !isValidMassaNetwork ||
    (BRIDGE_OFF && !massaToEvm) ||
    (REDEEM_OFF && massaToEvm);

  useEffect(() => {
    if (approve !== Status.Loading) {
      return;
    }
    if (approveSuccess && amount) {
      setApprove(Status.Success);
      setLock(Status.Loading);
      writeLock();
    } else if (approveError) {
      handleEvmApproveError(approveError);
      setBox(Status.Error);
      setApprove(Status.Error);
    }
  }, [
    approve,
    approveSuccess,
    approveError,
    amount,
    setApprove,
    setLock,
    setBox,
    writeLock,
  ]);

  // Lock operation information is set here in parent component
  useEffect(() => {
    if (lockHash) {
      setLockTxId(lockHash);
    }
    if (isLockSuccess) {
      setLock(Status.Success);
      setMint(Status.Loading);
    }
    if (lockError) {
      handleLockError(lockError);
      setBox(Status.Error);
      setLock(Status.Error);
    }
  }, [
    isLockSuccess,
    lockHash,
    lockError,
    setBox,
    setLock,
    setLockTxId,
    setMint,
  ]);

  // Submit logic handler
  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    // validate amount to transact
    if (!validate(tokenBalanceEVM) || !amount) return;
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
          setBurnState,
        });
      }
    } else {
      if (!selectedToken) {
        return;
      }
      // Init bridge approval
      setApprove(Status.Loading);
      let parsedAmount = parseUnits(amount, selectedToken.decimals);
      const needApproval = allowanceEVM < parsedAmount;

      if (needApproval) {
        // writing bridge approval
        writeEvmApprove();
        return;
      }
      // Bridge does not need approval : writing lock
      setApprove(Status.Success);
      writeLock();
      setLock(Status.Loading);
    }
  }

  const closeLoadingBox = useCallback(() => {
    reset();
    setAmount('');
    setBurnState(BurnState.INIT);
    // Reset all transaction id's
    resetTxIDs();
  }, [reset, setAmount, resetTxIDs]);

  useEffect(() => {
    if (box === Status.None) closeLoadingBox();
  }, [box, closeLoadingBox]);

  useEffect(() => {
    setAmountError('');
  }, [amount, side, selectedToken?.name, setAmountError]);

  // Submit button disable parameters
  const isButtonDisabled =
    isFetching ||
    !connectedAccount ||
    !isValidEthNetwork ||
    !isValidMassaNetwork ||
    isMainnet ||
    (BRIDGE_OFF && !massaToEvm) ||
    (REDEEM_OFF && massaToEvm);

  // Index render logic & style
  const isOperationPending = box !== Status.None;
  const isBlurred = isOperationPending ? 'blur-md' : '';

  return (
    <div className="flex flex-col gap-36 items-center justify-center w-full h-full min-h-screen">
      <BridgeRedeemLayout
        isBlurred={isBlurred}
        isButtonDisabled={isButtonDisabled}
      />
      {!isOperationPending && <ClaimTokensPopup />}
    </div>
  );
}
