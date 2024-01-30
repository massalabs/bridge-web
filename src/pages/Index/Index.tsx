import { useState, SyntheticEvent, useEffect } from 'react';
import { toast } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';
import { useAccount, useWaitForTransaction, useToken } from 'wagmi';
import { BridgeRedeemLayout } from './Layouts/BridgeRedeemLayout/BridgeRedeemLayout';
import { LoadingLayout } from './Layouts/LoadingLayout/LoadingLayout';
import { ClaimTokensPopup } from '@/components/ClaimTokensPopup/ClaimTokensPopup';
import { TokensFAQ } from '@/components/FAQ/TokensFAQ';
import { BRIDGE_OFF, REDEEM_OFF } from '@/const/env/maintenance';
import { handleApproveBridge } from '@/custom/bridge/handlers/handleApproveBridge';
import { handleApproveRedeem } from '@/custom/bridge/handlers/handleApproveRedeem';
import { handleBurnRedeem } from '@/custom/bridge/handlers/handleBurnRedeem';
import {
  LockBridgeParams,
  handleLockBridge,
} from '@/custom/bridge/handlers/handleLockBridge';
import {
  MintArgs,
  handleMintBridge,
} from '@/custom/bridge/handlers/handleMintBridge';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
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
  const { side, setSide } = useOperationStore();

  const { isConnected: isEvmWalletConnected, address: evmAddress } =
    useAccount();

  const {
    handleApprove: _handleApproveEVM,
    handleLock: _handleLockEVM,
    allowance: _allowanceEVM,
    tokenBalance: _tokenBalanceEVM,
    hashLock: _hashLockEVM,
    hashApprove: _hashApproveEVM,
  } = useEvmBridge();

  const {
    data: lockData,
    isSuccess: lockIsSuccess,
    isError: lockIsError,
  } = useWaitForTransaction({ hash: _hashLockEVM });

  const { isSuccess: approveIsSuccess, isError: approveIsError } =
    useWaitForTransaction({ hash: _hashApproveEVM });

  const evmToken = selectedToken?.evmToken as `0x${string}`;
  const { data: tokenData } = useToken({ address: evmToken });

  const [_interval, _setInterval] = useState<NodeJS.Timeout>();
  const [amount, setAmount] = useState<string | undefined>('');
  const [error, setError] = useState<{ amount: string } | null>(null);
  const [burnTxID, setBurnTxID] = useState<string>('');
  const [lockTxID, setLockTxID] = useState<string>('');
  const [redeemSteps, setRedeemSteps] = useState<string>(
    Intl.t('index.loading-box.burn'),
  );
  const { box, setBox, setLock, setApprove, reset } = useGlobalStatusesStore();

  const [decimals, setDecimals] = useState<number>(tokenData?.decimals || 18);
  const [wrongNetwork, setWrongNetwork] = useState<boolean>(false);

  useNetworkCheck(setWrongNetwork);

  const massaToEvm = side === SIDE.MASSA_TO_EVM;

  const isLoading = box !== Status.None;
  const isBlurred = isLoading ? 'blur-md' : '';
  const operationId = massaToEvm ? burnTxID : lockTxID;

  const isButtonDisabled =
    isFetching ||
    !connectedAccount ||
    !isEvmWalletConnected ||
    wrongNetwork ||
    isMainnet ||
    (BRIDGE_OFF && !massaToEvm) ||
    (REDEEM_OFF && massaToEvm);

  useEffect(() => {
    setError({ amount: '' });
    setDecimals(tokenData?.decimals || 18);
  }, [amount, side, selectedToken?.name, tokenData?.decimals]);

  useEffect(() => {
    setAmount('');
  }, [side, selectedToken?.name]);

  useEffect(() => {
    if (lockIsSuccess) {
      setLock(Status.Success);
      let data = lockData;
      if (!data) return;
      setLockTxID(data.transactionHash);
    }
    if (lockIsError) {
      setBox(Status.Error);
      setLock(Status.Error);
    }
  }, [lockIsSuccess, lockIsError]);

  useEffect(() => {
    if (!massaClient) return;
    if (lockTxID) {
      const mintArgs: MintArgs = {
        massaOperationID: lockTxID,
      };
      handleMintBridge(mintArgs);
    }
  }, [lockTxID]);

  useEffect(() => {
    if (approveIsSuccess) {
      setApprove(Status.Success);
      if (!amount) return;
      const lockArgs: LockBridgeParams = {
        amount,
        _handleLockEVM,
        decimals,
      };
      handleLockBridge(lockArgs);
    }
    if (approveIsError) {
      setBox(Status.Error);
      setApprove(Status.Error);
      toast.error(Intl.t('index.approve.error.failed'));
    }
  }, [approveIsSuccess, approveIsError]);

  useEffect(() => {
    if (box === Status.None) closeLoadingBox();
  }, [box]);

  function handleToggleLayout() {
    setSide(massaToEvm ? SIDE.EVM_TO_MASSA : SIDE.MASSA_TO_EVM);
  }

  function validate() {
    setError(null);

    if (!amount) {
      setError({ amount: Intl.t('index.approve.error.invalid-amount') });
      return false;
    }

    let _amount;
    let _balance;

    if (massaToEvm) {
      if (!selectedToken) {
        return false;
      }
      _amount = parseUnits(amount, decimals);
      _balance = selectedToken.balance;
    } else {
      _amount = parseUnits(amount, decimals);
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

    if (massaToEvm) {
      if (!massaClient || !selectedToken || !amount) {
        return;
      }
      const approved = await handleApproveRedeem(amount);

      if (approved) {
        if (!selectedToken || !evmAddress || !amount) {
          return;
        }

        await handleBurnRedeem({
          recipient: evmAddress,
          amount,
          setBurnTxID,
          setRedeemSteps,
        });
      }
    } else {
      if (!amount) {
        return;
      }
      const approved = await handleApproveBridge(
        amount,
        decimals,
        _handleApproveEVM,
        _allowanceEVM,
      );

      if (approved) {
        const lockArgs = {
          amount,
          _handleLockEVM,
          decimals,
        };
        await handleLockBridge(lockArgs);
      }
    }
  }

  function closeLoadingBox() {
    reset();
    setAmount('');
    // the lockTxID & burnTdID is not reset after mint/claim
    setLockTxID('');
    setBurnTxID('');
  }

  return (
    <div className="flex flex-col gap-36 items-center justify-center w-full h-full min-h-screen">
      {/* If loading -> show loading layout else show home page*/}
      {isLoading ? (
        <LoadingLayout
          onClose={closeLoadingBox}
          amount={amount ?? '0'}
          redeemSteps={redeemSteps}
          operationId={operationId}
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
