import { useEffect, useState } from 'react';
import { useAccountStore } from '@/store/store';
import {
  useContractWrite,
  useContractRead,
  useAccount,
  useBalance,
  erc20ABI,
} from 'wagmi';
import { EVM_BRIDGE_ADDRESS } from '@/const/const';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';

// TODO: Max u256 pour approval
const MAX_APPROVAL = 2n ** 256n - 1n;
// TODO: fix gas limit
const MAX_GAS = 1_000_000n;

const useEvmBridge = () => {
  const { address: accountAddress } = useAccount();
  const [token, massaAccount] = useAccountStore((state) => [
    state.token,
    state.account,
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

  const [tokenBalance, setTokenBalance] = useState<string>();
  const [allowance, setAllowance] = useState<bigint>(0n);
  const [hashLock, setHashLock] = useState<`0x${string}`>();
  const [hashApprove, setHashApprove] = useState<`0x${string}`>();

  useEffect(() => {
    if (!token) return;

    setTokenBalance(balanceData.data?.formatted || '0');
  }, [token, balanceData.data?.formatted]);

  useEffect(() => {
    if (!token) return;

    setAllowance(BigInt(_allowance.data || 0n));
  }, [token, _allowance?.data]);

  const approve = useContractWrite({
    functionName: 'approve',
    address: evmToken,
    abi: erc20ABI,
    gas: MAX_GAS,
    args: [EVM_BRIDGE_ADDRESS, MAX_APPROVAL],
  });

  const lock = useContractWrite({
    abi: bridgeVaultAbi,
    address: EVM_BRIDGE_ADDRESS,
    functionName: 'lock',
    gas: MAX_GAS,
  });

  async function handleApprove() {
    try {
      let { hash } = await approve.writeAsync();
      setHashApprove(hash);

      return approve;
    } catch (error) {
      console.log(error);
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
      console.log(error);
      throw error;
    }
  }

  return {
    tokenBalance,
    allowance,
    handleApprove,
    handleLock,
    hashApprove,
    hashLock,
  };
};

export default useEvmBridge;
