import { U256_MAX } from '@massalabs/massa-web3';
import { erc20Abi } from 'viem';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { CHAIN_ID_TO_SUPPORTED_BLOCKCHAIN, config } from '@/const/const';
import { useBridgeModeStore, useTokenStore } from '@/store/store';

export function useEvmApprove() {
  const { currentMode } = useBridgeModeStore();
  const { selectedToken } = useTokenStore();
  const { chainId } = useAccount();

  const chain = chainId || 0;

  const bridgeContractAddr =
    config[currentMode][CHAIN_ID_TO_SUPPORTED_BLOCKCHAIN[chain]];
  const evmToken = selectedToken?.evmToken as `0x${string}`;

  const { data: hash, writeContract, error } = useWriteContract();

  const write = () => {
    writeContract({
      address: evmToken,
      abi: erc20Abi,
      functionName: 'approve',
      args: [bridgeContractAddr, U256_MAX],
    });
  };

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  return { write, isSuccess, error };
}
