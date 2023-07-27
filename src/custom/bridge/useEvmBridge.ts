import { useEffect, useState } from 'react';
import { useAccountStore } from '@/store/store';
import { parseUnits } from 'viem';
import {
  useContractWrite,
  useContractRead,
  useAccount,
  useBalance,
  erc20ABI,
  useToken,
} from 'wagmi';
import { EVM_BRIDGE_ADDRESS } from '@/const/const';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { U256_MAX } from '@/utils/const';

// TODO: fix gas limit
const MAX_GAS = 1_000_000n;

const useEvmBridge = () => {
  const { address: accountAddress } = useAccount();
  const [token, massaAccount] = useAccountStore((state) => [
    state.token,
    state.account,
  ]);
  const evmToken = token?.evmToken as `0x${string}`;

  const { data: tokenData } = useToken({ address: evmToken });
  const decimals: number = tokenData?.decimals || 18;

  const balanceData = useBalance({
    token: evmToken,
    address: accountAddress,
    watch: true,
  });

  let _allowance = 0n;
  if (accountAddress) {
    const res = useContractRead({
      address: evmToken,
      abi: erc20ABI,
      functionName: 'allowance',
      args: [accountAddress, EVM_BRIDGE_ADDRESS],
      enabled: Boolean(accountAddress && token?.evmToken),
      watch: true,
    });
    if (res.error) {
      console.log(res.error)
      //TODO: handle error?
      //setError({ amount: Intl.t('index.approve.error.invalid-amount') });
    }
    _allowance = res.data ?? 0n;
  }


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

    setAllowance(_allowance || 0n);
  }, [token, _allowance]);

  const approve = useContractWrite({
    functionName: 'approve',
    address: evmToken,
    abi: erc20ABI,
    gas: MAX_GAS,
    args: [EVM_BRIDGE_ADDRESS, U256_MAX],
  });

  const lock = useContractWrite({
    abi: bridgeVaultAbi,
    address: EVM_BRIDGE_ADDRESS,
    functionName: 'lock',
    gas: MAX_GAS,
  });

  async function handleApprove() {
      let { hash } = await approve.writeAsync();
      setHashApprove(hash);
  }

  async function handleLock(amount: bigint) {
    try {
      let { hash } = await lock.writeAsync({
        args: [
          parseUnits(amount.toString(), decimals),
          massaAccount?.address(),
          token?.evmToken,
        ],
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
