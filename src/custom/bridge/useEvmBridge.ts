import { useEffect, useState } from 'react';
import {
  useContractWrite,
  useContractRead,
  useAccount,
  useBalance,
  erc20ABI,
} from 'wagmi';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
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
    watch: true,
  });

  const _allowance = useContractRead({
    address: evmToken,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [evmUserAddress, bridgeContractAddr],
    enabled: Boolean(accountAddress && evmToken),
    watch: true,
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

  const redeem = useContractWrite({
    abi: bridgeVaultAbi,
    address: bridgeContractAddr,
    functionName: 'redeem',
  });

  async function handleRedeem(
    amount: string,
    recipient: `0x${string}`,
    token: `0x${string}`,
    burnOpId: string,
    signatures: string[],
  ): Promise<boolean> {
    try {
      await redeem.writeAsync({
        args: [amount, recipient, burnOpId, token, signatures],
      });
      return true;
    } catch (error) {
      throw new Error(`Error during redeem. Error:${error}`);
    }
  }

  return {
    tokenBalance,
    allowance,
    handleRedeem,
  };
};

export default useEvmBridge;
