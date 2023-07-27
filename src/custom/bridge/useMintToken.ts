import {
  usePrepareContractWrite,
  useContractWrite,
  useAccount,
  useWaitForTransaction,
} from 'wagmi';

interface useMintTokenProps {
  tokenAddress: string;
}

export function useMintToken({ tokenAddress }: useMintTokenProps) {
  const { address } = useAccount();

  const prepareContractWrite = usePrepareContractWrite({
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
    value: BigInt(0),
  });
  const contractWrite = useContractWrite(prepareContractWrite.config);

  const waitForTransaction = useWaitForTransaction({
    hash: contractWrite.data?.hash,
  });

  return { contractWrite, waitForTransaction, prepareContractWrite };
}
