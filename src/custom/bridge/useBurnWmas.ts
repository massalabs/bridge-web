import { useCallback, useEffect, useState } from 'react';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { W_MASS_ADDRESS } from '@/const';

export function useBurnWMAS() {
  const { data: hash, writeContract, error } = useWriteContract();

  const [isBurnSuccess, setIsBurnSuccess] = useState<boolean>(false);
  const [burnHash, setBurnHash] = useState<`0x${string}` | undefined>(
    undefined,
  );

  const write = useCallback(
    (amount: bigint, massaAddress: string) => {
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
        address: W_MASS_ADDRESS,
        functionName,
        args: [amount, massaAddress],
      });
    },
    [writeContract, W_MASS_ADDRESS],
  );

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (hash) {
      setBurnHash(hash);
    }
    if (isSuccess) {
      setIsBurnSuccess(true);
    }
    if (error) {
      console.error(error);
    }
  }, [isSuccess, error, hash, setIsBurnSuccess, setBurnHash]);

  return { write, isBurnSuccess, burnHash };
}
