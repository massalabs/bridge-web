import { useCallback, useEffect, useState } from 'react';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { config } from '@/const';
import { useBridgeModeStore } from '@/store/store';

export function useBurnWMAS() {
  const { data: hash, writeContract, error } = useWriteContract();
  const { currentMode } = useBridgeModeStore();

  const [isBurnSuccess, setIsBurnSuccess] = useState<boolean>(false);
  const [burnHash, setBurnHash] = useState<`0x${string}` | undefined>(
    undefined,
  );
  const W_MASS_ADDRESS = config[currentMode].wmas_address;

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

  const { isSuccess, data } = useWaitForTransactionReceipt({
    hash,
  });

  // Add rejection handling
  useEffect(() => {
    if (hash) {
      setBurnHash(hash);
    }
    if (isSuccess && data) {
      // Would it be acceptable to call the updateReleaseMasStep()
      // directly here instead of depending on another useEffect ?
      setIsBurnSuccess(true);
    }
    if (error) {
      console.error(error);
    }
  }, [isSuccess, error, hash, setIsBurnSuccess, setBurnHash, data]);

  return { write, isBurnSuccess, burnHash };
}
