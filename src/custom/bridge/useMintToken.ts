import { useCallback } from 'react';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

interface useMintTokenProps {
  tokenAddress: string;
}

export function useMintToken({ tokenAddress }: useMintTokenProps) {
  const { address } = useAccount();

  const { data: hash, writeContract, error } = useWriteContract();

  const write = useCallback(() => {
    if (!address) return;
    writeContract({
      address: tokenAddress as `0x${string}`,
      abi: [
        {
          inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
          name: 'create',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      functionName: 'create',
      args: [address],
    });
  }, [address, tokenAddress, writeContract]);

  const { isSuccess, isLoading } = useWaitForTransactionReceipt({
    hash,
  });

  return { isSuccess, isLoading, error, write };
}
