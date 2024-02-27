import { useCallback } from 'react';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { config } from '@/const/const';
import { useBridgeModeStore } from '@/store/store';

interface BurnWMASArguments {
  amount: bigint;
  massaAddress: string;
}

export function useBurnWMAS() {
  const { currentMode } = useBridgeModeStore();

  const wMASContractAddr = config[currentMode].wMAS;

  const { data: hash, writeContract, error, isPending } = useWriteContract();

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

  return { isPending, isSuccess, error, write, hash };
}
