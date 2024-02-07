import { useState, SyntheticEvent, useEffect, useCallback } from 'react';
import { toast } from '@massalabs/react-ui-kit';
import { Log, parseUnits } from 'viem';
import { useAccount, useToken, useContractEvent } from 'wagmi';
import { BridgeRedeemLayout } from './Layouts/BridgeRedeemLayout/BridgeRedeemLayout';
import { LoadingLayout } from './Layouts/LoadingLayout/LoadingLayout';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { ClaimTokensPopup } from '@/components/ClaimTokensPopup/ClaimTokensPopup';
import { TokensFAQ } from '@/components/FAQ/TokensFAQ';
import { config } from '@/const';
import { BRIDGE_OFF, REDEEM_OFF } from '@/const/env/maintenance';
import { handleApproveRedeem } from '@/custom/bridge/handlers/handleApproveRedeem';
import { handleBurnRedeem } from '@/custom/bridge/handlers/handleBurnRedeem';
import { handleLockError } from '@/custom/bridge/handlers/handleLockBridge';
import { handleMintBridge } from '@/custom/bridge/handlers/handleMintBridge';
import { useEvmApprove } from '@/custom/bridge/useEvmApprove';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
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
import { CustomError, isRejectedByUser } from '@/utils/error';

export function Index() {
  const { massaClient, connectedAccount, isFetching } = useAccountStore();
  const { selectedToken, refreshBalances } = useTokenStore();
  const { isMainnet, currentMode } = useBridgeModeStore();
  const { side, setSide, currentTxID, setCurrentTxID, amount, setAmount } =
    useOperationStore();

  const { isConnected: isEvmWalletConnected, address: evmAddress } =
    useAccount();

  const { allowance: _allowanceEVM, tokenBalance: _tokenBalanceEVM } =
    useEvmBridge();

  const evmToken = selectedToken?.evmToken as `0x${string}`;
  const { data: tokenData } = useToken({ address: evmToken });

  const [_interval, _setInterval] = useState<NodeJS.Timeout>();
  const [error, setError] = useState<{ amount: string } | null>(null);

  const [redeemSteps, setRedeemSteps] = useState<string>(
    Intl.t('index.loading-box.burn'),
  );
  const [redeemLogs, setRedeemLogs] = useState<Log[]>([]);

  const { box, setBox, setClaim, setLock, setApprove, reset } =
    useGlobalStatusesStore();

  const [decimals, setDecimals] = useState<number>(tokenData?.decimals || 18);
  const [wrongNetwork, setWrongNetwork] = useState<boolean>(false);

  useNetworkCheck(setWrongNetwork);

  const massaToEvm = side === SIDE.MASSA_TO_EVM;

  const isLoading = box !== Status.None;
  const isBlurred = isLoading ? 'blur-md' : '';

  const isButtonDisabled =
    isFetching ||
    !connectedAccount ||
    !isEvmWalletConnected ||
    wrongNetwork ||
    isMainnet ||
    (BRIDGE_OFF && !massaToEvm) ||
    (REDEEM_OFF && massaToEvm);

  const stopListeningRedeemedEvent = useContractEvent({
    address: config[currentMode].evmBridgeContract,
    abi: bridgeVaultAbi,
    eventName: 'Redeemed',
    listener(logs) {
      setRedeemLogs(logs);
      stopListeningRedeemedEvent?.();
    },
  });

  const {
    isSuccess: approveIsSuccess,
    isError: approveIsError,
    write: writeEvmApprove,
  } = useEvmApprove();

  const {
    isSuccess: lockIsSuccess,
    isError: lockIsError,
    write: writeLock,
    data: lockData,
  } = useLock();

  useEffect(() => {
    if (!redeemLogs.length) return;
    const event = redeemLogs.find(
      (log: any) => log.args.burnOpId === currentTxID,
    );
    if (event && box === Status.Loading) {
      setBox(Status.Success);
      setClaim(Status.Success);
      refreshBalances();
    }
  }, [redeemLogs, box, currentTxID, setBox, setClaim, refreshBalances]);

  useEffect(() => {
    setError({ amount: '' });
    setDecimals(tokenData?.decimals || 18);
  }, [amount, side, selectedToken?.name, tokenData?.decimals]);

  useEffect(() => {
    setAmount();
  }, [side, selectedToken?.name, setAmount]);

  useEffect(() => {
    if (lockIsSuccess) {
      setLock(Status.Success);
      if (!lockData) return;
      // Set lock id
      setCurrentTxID(lockData.hash);
      if (!massaClient) return;
      handleMintBridge();
    }
    if (lockIsError) {
      setBox(Status.Error);
      setLock(Status.Error);
    }
  }, [
    lockIsSuccess,
    lockIsError,
    lockData,
    massaClient,
    setLock,
    setBox,
    setCurrentTxID,
  ]);

  const processLock = useCallback(() => {
    try {
      setLock(Status.Loading);
      writeLock?.();
    } catch (error) {
      handleLockError(error);
      setLock(Status.Error);
      setBox(Status.Error);
    }
  }, [writeLock, setLock, setBox]);

  useEffect(() => {
    if (approveIsSuccess) {
      setApprove(Status.Success);
      if (!amount) return;
      processLock();
    }
    if (approveIsError) {
      setBox(Status.Error);
      setApprove(Status.Error);
      toast.error(Intl.t('index.approve.error.failed'));
    }
  }, [
    approveIsSuccess,
    approveIsError,
    amount,
    decimals,
    setApprove,
    setLock,
    setBox,
    processLock,
  ]);

  const closeLoadingBox = useCallback(() => {
    reset();
    setAmount();
    // Reset currentTxID
    setCurrentTxID();
  }, [reset, setAmount, setCurrentTxID]);

  useEffect(() => {
    if (box === Status.None) closeLoadingBox();
  }, [box, closeLoadingBox]);

  function handleToggleLayout() {
    setSide(massaToEvm ? SIDE.EVM_TO_MASSA : SIDE.MASSA_TO_EVM);
  }

  function validate() {
    setError(null);

    if (!amount) {
      setError({ amount: Intl.t('index.approve.error.invalid-amount') });
      return false;
    }

    const _amount = parseUnits(amount, decimals);
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
    if (!validate()) return;
    setBox(Status.Loading);

    if (!amount) {
      // for typescript type inference
      // if amount is undefined, validate() should return false
      return;
    }

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
      setApprove(Status.Loading);

      let _amount = parseUnits(amount, decimals);
      const needApproval = _allowanceEVM < _amount;

      if (needApproval) {
        try {
          writeEvmApprove?.();
        } catch (error) {
          if (isRejectedByUser(error as CustomError)) {
            toast.error(Intl.t('index.approve.error.rejected'));
          } else {
            // error comes from increaseAllowanceFunction
            toast.error(Intl.t('index.approve.error.allowance-error'));
          }
          setApprove(Status.Error);
          setBox(Status.Error);
        }
        return;
      }
      setApprove(Status.Success);
      processLock();
    }
  }

  return (
    <div className="flex flex-col gap-36 items-center justify-center w-full h-full min-h-screen">
      {/* If loading -> show loading layout else show home page*/}
      {isLoading ? (
        <LoadingLayout
          onClose={closeLoadingBox}
          amount={amount ?? '0'}
          redeemSteps={redeemSteps}
          decimals={decimals}
        />
      ) : (
        <BridgeRedeemLayout
          isBlurred={isBlurred}
          isButtonDisabled={isButtonDisabled}
          amount={amount}
          error={error}
          decimals={decimals}
          setAmount={setAmount}
          setError={setError}
          handleSubmit={handleSubmit}
          handleToggleLayout={handleToggleLayout}
        />
      )}

      <TokensFAQ />
      {!isLoading && <ClaimTokensPopup />}
    </div>
  );
}
