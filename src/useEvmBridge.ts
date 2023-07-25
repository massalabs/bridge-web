import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Intl from '@/i18n/i18n';
import { toast } from '@massalabs/react-ui-kit';
import { useAccountStore } from '@/store/store';
import { parseUnits } from 'viem';

import {
  useContractWrite,
  useContractRead,
  useAccount,
  useBalance,
  erc20ABI,
  useToken,
  useWaitForTransaction,
} from 'wagmi';
import { EVM_BRIDGE_ADDRESS } from '@/const/const';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';

type loadingState = 'success' | 'error' | 'loading' | 'none';
interface useEvmBridgeProps {
  setLoading: Dispatch<SetStateAction<loadingState>>;
  setBridgeLoading: Dispatch<SetStateAction<loadingState>>;
  setApproveLoading: Dispatch<SetStateAction<loadingState>>;
}

// TODO: Max u256 pour approval
const MAX_APPROVAL = 2n ** 256n - 1n;
// TODO: fix gas limit
const MAX_GAS = 1_000_000n;

const useEvmBridge = ({
  setLoading,
  setBridgeLoading,
  setApproveLoading,
}: useEvmBridgeProps) => {
  const [evmAmountToBridge, setEvmAmountToBridge] = useState<string>('0');
  const { address: accountAddress } = useAccount();
  const [token, massaAccount] = useAccountStore((state) => [
    state.token,
    state.account,
  ]);
  const evmToken = token?.evmToken as `0x${string}`;

  const { data: tokenData } = useToken({ address: evmToken });
  const decimals: number = tokenData?.decimals || 18;
  const evmUserAddress = accountAddress ? accountAddress : '0x00000';

  const balanceData = useBalance({
    token: evmToken,
    address: accountAddress,
    watch: true,
  });

  const [evmTokenBalance, setEvmTokenBalance] = useState<string>();

  useEffect(() => {
    if (!token) return;
    setEvmTokenBalance(balanceData.data?.formatted || '0');
  }, [token, balanceData.data?.formatted]);

  const allowance = useContractRead({
    address: evmToken,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [evmUserAddress, EVM_BRIDGE_ADDRESS],
    enabled: Boolean(accountAddress && token?.evmToken),
  });

  const allowanceValue = BigInt(allowance.data || 0n);

  const { write: approve, data: approveData } = useContractWrite({
    functionName: 'approve',
    address: evmToken,
    abi: erc20ABI,
    gas: MAX_GAS,
    args: [EVM_BRIDGE_ADDRESS, MAX_APPROVAL],
  });

  const {
    isLoading: approvalIsPending,
    isSuccess: approvalIsSuccess,
    isError: approvalIsError,
  } = useWaitForTransaction({
    hash: approveData?.hash,
  });

  const { write: lock, ...lockState } = useContractWrite({
    abi: bridgeVaultAbi,
    address: EVM_BRIDGE_ADDRESS,
    functionName: 'lock',
    gas: MAX_GAS,
  });

  const {
    isLoading: lockIsPending,
    isSuccess: lockIsSuccess,
    isError: lockIsError,
  } = useWaitForTransaction({
    hash: lockState.data?.hash,
  });

  async function handleBridgeEvm(amount: bigint) {
    if (Number(evmTokenBalance) < Number(amount)) {
      toast.error(Intl.t(`index.bridge.error.lowBalance`));
      console.log('low balance');
      return;
    }
    try {
      setApproveLoading('loading');
      if (allowanceValue < BigInt(evmAmountToBridge)) await approve();
      else {
        setApproveLoading('success');
        await handleLockEvm(BigInt(evmAmountToBridge));
      }
    } catch (error) {
      console.log(error);
      toast.error(Intl.t(`index.bridge.error.general`));
    }
  }

  async function handleLockEvm(amount: bigint) {
    setBridgeLoading('loading');
    try {
      await lock({
        args: [
          parseUnits(amount.toString(), decimals),
          massaAccount?.address(),
          token?.evmToken,
        ],
      });
    } catch (error) {
      console.log(error);
      toast.error(Intl.t(`index.bridge.error.general`));
    }
  }

  useEffect(() => {
    if (approvalIsSuccess) {
      setApproveLoading('success');
      handleLockEvm(BigInt(evmAmountToBridge));
    }
    if (approvalIsError) {
      setApproveLoading('error');
    }
  }, [approvalIsPending, approvalIsSuccess]);

  useEffect(() => {
    if (lockIsSuccess) {
      setBridgeLoading('success');
      setEvmAmountToBridge('0');
      stopLoading();
    }
    if (lockIsError) {
      setBridgeLoading('error');
      stopLoading();
    }
  }, [lockIsPending, lockIsSuccess]);

  function stopLoading() {
    setApproveLoading('none');
    setBridgeLoading('none');
    setLoading('none');
  }
  return {
    evmTokenBalance,
    handleBridgeEvm,
    setEvmAmountToBridge,
  };
};

export default useEvmBridge;
