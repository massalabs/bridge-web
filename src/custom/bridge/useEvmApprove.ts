import { U256_MAX } from '@massalabs/massa-web3';
import { erc20Abi } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { config } from '@/const/const';
import {
  useBridgeModeStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';

export function useEvmApprove() {
  const { currentMode } = useBridgeModeStore();
  const { selectedToken } = useTokenStore();
  const { selectedEvm } = useOperationStore();

  const bridgeContractAddr = config[currentMode][selectedEvm];
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
