import { U256_MAX } from '@massalabs/massa-web3';
import {
  erc20ABI,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { config } from '@/const/const';
import { useBridgeModeStore, useTokenStore } from '@/store/store';

export function useEvmApprove() {
  const { currentMode } = useBridgeModeStore();
  const { selectedToken } = useTokenStore();

  const bridgeContractAddr = config[currentMode].evmBridgeContract;
  const evmToken = selectedToken?.evmToken as `0x${string}`;

  const { config: writeConfig } = usePrepareContractWrite({
    address: evmToken,
    abi: erc20ABI,
    functionName: 'approve',
    args: [bridgeContractAddr, U256_MAX],
  });

  const { data, write } = useContractWrite(writeConfig);

  const { isSuccess, isError } = useWaitForTransaction({
    hash: data?.hash,
  });

  return { isSuccess, isError, write };
}
