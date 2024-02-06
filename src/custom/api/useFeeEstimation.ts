import { useCallback, useEffect, useState } from 'react';
import {
  erc20ABI,
  fetchFeeData,
  getConfig,
  mainnet,
  sepolia,
} from '@wagmi/core';
import { parseUnits } from 'viem';
import { useAccount, useToken } from 'wagmi';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { U256_MAX, config } from '@/const';
import {
  useAccountStore,
  useBridgeModeStore,
  useTokenStore,
} from '@/store/store';

const VITE_CLAIM_GAS_COST = import.meta.env.VITE_CLAIM_GAS_COST || '92261';
const VITE_LOCK_GAS_COST = import.meta.env.VITE_LOCK_GAS_COST || '73185';

export function useFeeEstimation() {
  const { currentMode, isMainnet } = useBridgeModeStore();
  const bridgeContractAddr = config[currentMode].evmBridgeContract;
  const { selectedToken } = useTokenStore();
  const evmToken = selectedToken?.evmToken as `0x${string}`;
  const { data: tokenData } = useToken({ address: evmToken });
  const { connectedAccount: massaAccount } = useAccountStore();
  const { address: accountAddress } = useAccount();

  const [gasPrice, setGasPrice] = useState<bigint>(0n);

  const publicClient = getConfig().getPublicClient();

  useEffect(() => {
    fetchFeeData({
      chainId: isMainnet ? mainnet.id : sepolia.id,
    }).then((feeData) => {
      setGasPrice(feeData.maxFeePerGas || 0n);
    });
  }, [isMainnet]);

  const estimateClaimFees = () => BigInt(VITE_CLAIM_GAS_COST) * gasPrice;

  const estimateLockFees = useCallback(
    (amount: string) => {
      if (!accountAddress || !massaAccount || !tokenData) {
        return 0n;
      }

      const amountInBigInt = parseUnits(amount || '0', tokenData.decimals);

      return publicClient
        .estimateContractGas({
          functionName: 'lock',
          address: bridgeContractAddr,
          abi: bridgeVaultAbi,
          args: [amountInBigInt, massaAccount.address(), evmToken],
          account: accountAddress,
        })
        .catch(() => {
          return BigInt(VITE_LOCK_GAS_COST);
        })
        .then((gas) => {
          return gas * gasPrice;
        });
    },
    [
      gasPrice,
      accountAddress,
      massaAccount,
      tokenData,
      evmToken,
      bridgeContractAddr,
      publicClient,
    ],
  );

  const estimateApproveFees = useCallback(() => {
    if (!accountAddress) {
      return 0n;
    }

    return publicClient
      .estimateContractGas({
        functionName: 'approve',
        address: evmToken,
        abi: erc20ABI,
        args: [bridgeContractAddr, U256_MAX],
        account: accountAddress,
      })
      .then((gas) => {
        return gas * gasPrice;
      });
  }, [gasPrice, accountAddress, evmToken, bridgeContractAddr, publicClient]);

  return { estimateClaimFees, estimateLockFees, estimateApproveFees };
}
