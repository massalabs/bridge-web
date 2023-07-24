import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { maskAddress } from '@/utils/massaFormat';
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

interface useEvmBridgeProps {
  setLoading: Dispatch<
    SetStateAction<'success' | 'error' | 'loading' | 'none'>
  >;
}

// TODO: Max u256 pour approval
const MAX_APPROVAL = 2n ** 256n - 1n;
// TODO: fix gas limit
const MAX_GAS = 1_000_000n;

const useEvmBridge = ({ setLoading }: useEvmBridgeProps) => {
  const { address: accountAddress } = useAccount();
  const [token, massaAccount] = useAccountStore((state) => [
    state.token,
    state.account,
  ]);

  const { data: tokenData } = useToken({ address: token?.evmToken });
  const decimals: number = tokenData?.decimals || 18;
  const evmUserAddress = accountAddress ? accountAddress : '0x00000';

  const balanceData = useBalance({
    token: token?.evmToken,
    address: accountAddress,
  });

  const [evmTokenBalance, setEvmTokenBalance] = useState<string>();

  useEffect(() => {
    if (!token) return;
    setEvmTokenBalance(balanceData.data?.formatted || '0');
  }, [token]);

  const allowance = useContractRead({
    address: token?.evmToken,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [evmUserAddress, EVM_BRIDGE_ADDRESS],
    enabled: Boolean(accountAddress && token?.evmToken),
  });

  const allowanceValue = BigInt(allowance.data || 0n);

  const { write: approve, data: approveData } = useContractWrite({
    functionName: 'approve',
    address: token?.evmToken,
    abi: erc20ABI,
    gas: MAX_GAS,
    args: [EVM_BRIDGE_ADDRESS, MAX_APPROVAL],
  });

  const {
    data: approvalReceipt,
    isLoading: approvalIsPending,
    isSuccess: approvalIsSuccess,
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
    data: lockReceipt,
    isLoading: lockIsPending,
    isSuccess: lockIsSuccess,
    isError: lockIsError,
  } = useWaitForTransaction({
    hash: lockState.data?.hash,
  });

  useEffect(() => {
    if (!approvalIsPending && approvalIsSuccess) {
      console.log(approvalReceipt);
      // TODO: update Loading when ok
      // setLoading(false);
      // Personalize success message
      toast.success(
        Intl.t(`index.approve.success`, {
          // TODO: What to put in maskAddress ?
          from: maskAddress(String(accountAddress)),
        }),
      );
    }
  }, [approvalIsPending, approvalIsSuccess]);

  useEffect(() => {
    // If no allowance, error
    if (!lockIsPending && lockIsSuccess) {
      console.log(lockReceipt);
      // TODO: update Loading when ok
      // setLoading(false);
      toast.success(
        Intl.t(`index.bridge.success`, {
          // TODO: What to put in maskAddress ?
          from: maskAddress(String(accountAddress)),
        }),
      );
    }
    if (lockIsError) {
      toast.error(Intl.t(`index.bridge.error.general`));
      // TODO: update Loading when ok
      // setLoading(false);
    }
    balanceData.refetch();
    // Refetch token balance on massa side
  }, [lockIsPending, lockIsSuccess]);

  async function handleEvmApprove() {
    if (!accountAddress) {
      toast.error(Intl.t(`index.bridge.error.noAddress`));
      return;
    }

    try {
      // TODO: update Loading when ok
      // setLoading(true);
      approve();
    } catch (error) {
      // TODO: Improve error handling
      console.log(error);
      // TODO: update Loading when ok
      // setLoading(false);
      toast.error(Intl.t(`index.bridge.error.general`));
    }
  }

  async function handleBridgeEvm(amount: bigint) {
    // TODO: Improve error handling
    if (!amount) {
      toast.error(Intl.t(`index.bridge.error.amount`));
      console.log('no amount');
      return;
    }
    if (Number(evmTokenBalance) < Number(amount)) {
      toast.error(Intl.t(`index.bridge.error.lowBalance`));
      console.log('low balance');
      return;
    }
    // TODO: update Loading when ok
    // setLoading(true);

    try {
      lock({
        args: [
          parseUnits(amount.toString(), decimals),
          massaAccount?.address(),
          token?.evmToken,
        ],
      });
    } catch (error) {
      // TODO: Improve error handling
      console.log(error);
      // TODO: update Loading when ok
      // setLoading(false);
      toast.error(Intl.t(`index.bridge.error.general`));
    }
  }

  return {
    tokenData,
    allowanceValue,
    evmTokenBalance,
    handleEvmApprove,
    handleBridgeEvm,
  };
};

export default useEvmBridge;
