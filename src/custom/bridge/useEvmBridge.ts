import { useEffect, useState } from 'react';
import { erc20Abi } from 'viem';
import { useAccount, useBalance, useReadContract } from 'wagmi';
import { config } from '@/const/const';
import { useBridgeModeStore, useTokenStore } from '@/store/store';

const useEvmBridge = () => {
  const { address: accountAddress } = useAccount();
  const { selectedToken } = useTokenStore();
  const { currentMode } = useBridgeModeStore();

  const bridgeContractAddr = config[currentMode].evmBridgeContract;

  const evmToken = selectedToken?.evmToken as `0x${string}`;

  const evmUserAddress = accountAddress ? accountAddress : '0x00000';

  const balanceData = useBalance({
    token: evmToken,
    address: accountAddress,
  });

  const _allowance = useReadContract({
    address: evmToken,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [evmUserAddress, bridgeContractAddr],
  });

  const [tokenBalance, setTokenBalance] = useState<bigint>(0n);
  const [allowance, setAllowance] = useState<bigint>(0n);

  useEffect(() => {
    if (!selectedToken) return;

    setTokenBalance(balanceData.data?.value ?? 0n);
  }, [selectedToken, balanceData.data?.value]);

  useEffect(() => {
    if (!selectedToken) return;

    setAllowance(_allowance.data || 0n);
  }, [selectedToken, _allowance?.data]);

  return {
    tokenBalance,
    allowance,
  };
};

export default useEvmBridge;
