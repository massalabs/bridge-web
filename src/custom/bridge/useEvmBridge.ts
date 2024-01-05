import { useEffect, useState } from 'react';

import {
  useContractWrite,
  useContractRead,
  useAccount,
  useBalance,
  erc20ABI,
} from 'wagmi';

import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { EVM_BRIDGE_ADDRESS, U256_MAX } from '@/const/const';
import { useAccountStore } from '@/store/store';

const useEvmBridge = () => {
  const { address: accountAddress } = useAccount();
  const [token, massaAccount] = useAccountStore((state) => [
    state.token,
    state.connectedAccount,
  ]);
  const evmToken = token?.evmToken as `0x${string}`;

  const evmUserAddress = accountAddress ? accountAddress : '0x00000';

  const balanceData = useBalance({
    token: evmToken,
    address: accountAddress,
    watch: true,
  });

  const _allowance = useContractRead({
    address: evmToken,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [evmUserAddress, EVM_BRIDGE_ADDRESS],
    enabled: Boolean(accountAddress && token?.evmToken),
    watch: true,
  });

  const [tokenBalance, setTokenBalance] = useState<bigint>(0n);
  const [allowance, setAllowance] = useState<bigint>(0n);
  const [hashLock, setHashLock] = useState<`0x${string}`>();
  const [hashApprove, setHashApprove] = useState<`0x${string}`>();

  useEffect(() => {
    if (!token) return;

    setTokenBalance(balanceData.data?.value ?? 0n);
  }, [token, balanceData.data?.value]);
  useEffect(() => {
    if (!token) return;

    setAllowance(_allowance.data || 0n);
  }, [token, _allowance?.data]);

  const approve = useContractWrite({
    functionName: 'approve',
    address: evmToken,
    abi: erc20ABI,
    args: [EVM_BRIDGE_ADDRESS, U256_MAX],
  });

  const lock = useContractWrite({
    abi: bridgeVaultAbi,
    address: EVM_BRIDGE_ADDRESS,
    functionName: 'lock',
  });

  const redeem = useContractWrite({
    abi: bridgeVaultAbi,
    address: EVM_BRIDGE_ADDRESS,
    functionName: 'redeem',
  });

  async function handleRedeem(
    amount: bigint,
    recipient: `0x${string}`,
    burnopId: string,
    signatures: string[],
  ): Promise<boolean> {
    try {
      await redeem.writeAsync({
        args: [
          amount.toString(),
          recipient,
          burnopId,
          token?.evmToken,
          signatures,
        ],
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async function handleApprove() {
    try {
      let { hash } = await approve.writeAsync();
      setHashApprove(hash);

      return approve;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function handleLock(amount: bigint) {
    try {
      let { hash } = await lock.writeAsync({
        args: [amount.toString(), massaAccount?.address(), token?.evmToken],
      });
      setHashLock(hash);
      return lock;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return {
    tokenBalance,
    allowance,
    handleApprove,
    handleLock,
    handleRedeem,
    hashApprove,
    hashLock,
  };
};

export default useEvmBridge;
