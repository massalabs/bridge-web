import { useDebounceValue } from 'usehooks-ts';
import { parseUnits } from 'viem';
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { config } from '@/const/const';
import {
  useAccountStore,
  useBridgeModeStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';

export function useLock() {
  const { currentMode } = useBridgeModeStore();
  const { selectedToken } = useTokenStore();
  const { connectedAccount } = useAccountStore();
  const { amount } = useOperationStore();
  const [debouncedAmount] = useDebounceValue(amount, 500);

  const bridgeContractAddr = config[currentMode].evmBridgeContract;
  const evmToken = selectedToken?.evmToken as `0x${string}`;

  const { config: writeConfig, isSuccess: isPrepared } =
    usePrepareContractWrite({
      abi: bridgeVaultAbi,
      address: bridgeContractAddr,
      functionName: 'lock',
      args: [
        parseUnits(
          debouncedAmount || '0',
          selectedToken?.decimals || 18,
        ).toString(),
        connectedAccount?.address(),
        evmToken,
      ],
      enabled: Boolean(amount && connectedAccount && selectedToken),
    });

  const { write, data, error, isError } = useContractWrite(writeConfig);

  const { isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    timeout: 30000,
  });

  return { data, isPrepared, isSuccess, isError, error, write };
}
