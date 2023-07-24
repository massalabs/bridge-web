import { Dispatch, SetStateAction, useEffect } from 'react';
import { maskAddress } from '@/utils/massaFormat';
import Intl from '@/i18n/i18n';
import { toast } from '@massalabs/react-ui-kit';
import { useAccountStore } from '@/store/store';
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

// TODO: fix gas limit
const MAX_GAS = 1_000_000n;

const useEvmBridge = ({ setLoading }: useEvmBridgeProps) => {
  const { address: accountAddress } = useAccount();
  const [token, massaAccount] = useAccountStore((state) => [
    state.token,
    state.account,
  ]);
  const { data: tokenData } = useToken({ address: token?.evmToken });

  const evmUserAddress = accountAddress ? accountAddress : '0x00000';

  const balanceData = useBalance({
    token: token?.evmToken ? token?.evmToken : '0x00000',
    address: accountAddress ? accountAddress : '0x00000',
    enabled: Boolean(accountAddress && token?.evmToken),
  });

  const evmTokenBalance = BigInt(balanceData.data?.formatted || 0);

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
  }, [lockIsPending, lockIsSuccess]);

  async function handleEvmApprove(amount: bigint) {
    if (!accountAddress) {
      toast.error(Intl.t(`index.bridge.error.noAddress`));
      return;
    }

    try {
      if (allowanceValue < amount) {
        // TODO: update Loading when ok
        // setLoading(true);
        approve({
          args: [EVM_BRIDGE_ADDRESS, 10000n],
        });
      }
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
    if (evmTokenBalance < 10000n) {
      toast.error(Intl.t(`index.bridge.error.lowBalance`));
      console.log('low balance');
      return;
    }
    // TODO: update Loading when ok
    // setLoading(true);

    try {
      lock({
        args: [amount, massaAccount?.address, token?.evmToken],
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
