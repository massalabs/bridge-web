import { useCallback, useEffect } from 'react';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import {
  handleBurnWMASError,
  handleWMASBridge,
} from './handlers/handleWMASBridge';
import { config } from '@/const/const';
import { Status } from '@/store/globalStatusesStore';
import {
  useBridgeModeStore,
  useGlobalStatusesStore,
  useOperationStore,
} from '@/store/store';

interface BurnWMASArguments {
  amount: bigint;
  massaAddress: string;
}

export function useBurnWMAS() {
  const { currentMode } = useBridgeModeStore();
  const { setBurnWMAS, setBox } = useGlobalStatusesStore();
  const { setBurnWMASTxId } = useOperationStore();

  const wMASContractAddr = config[currentMode].wMAS;

  const { data: hash, writeContract, error } = useWriteContract();

  const write = useCallback(
    (operation: BurnWMASArguments) => {
      const functionName = 'burn';
      writeContract({
        abi: [
          {
            inputs: [
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
              { internalType: 'string', name: 'massaAddress', type: 'string' },
            ],
            name: functionName,
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        address: wMASContractAddr,
        functionName,
        args: [operation.amount, operation.massaAddress],
      });
    },
    [writeContract, wMASContractAddr],
  );

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      setBurnWMAS(Status.Success);
      if (!hash) return;
      setBurnWMASTxId(hash);
      handleWMASBridge();
    }
    if (error) {
      handleBurnWMASError(error);
      setBox(Status.Error);
      setBurnWMAS(Status.Error);
    }
  }, [isSuccess, error, hash, setBurnWMAS, setBox, setBurnWMASTxId]);

  return { write };
}
