import { useCallback, useEffect, useState } from 'react';
import { toast } from '@massalabs/react-ui-kit';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { config } from '@/const';
import Intl from '@/i18n/i18n';
import { useBridgeModeStore } from '@/store/store';
import { bscMinConfirmations } from '@/utils/const';
import { CustomError, isRejectedByUser } from '@/utils/error';

export function useBurnWMAS() {
  const {
    data: hash,
    writeContract,
    error: burnWriteError,
    isError: isBurnWriteError,
  } = useWriteContract();
  const { currentMode } = useBridgeModeStore();

  const [isBurnSuccess, setIsBurnSuccess] = useState<boolean>(false);
  const [burnHash, setBurnHash] = useState<`0x${string}` | undefined>(
    undefined,
  );
  const W_MASS_ADDRESS = config[currentMode].wmas_address;

  const write = useCallback(
    (amount: bigint, massaAddress: string) => {
      writeContract({
        abi: [
          {
            inputs: [
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
              { internalType: 'string', name: 'massaAddress', type: 'string' },
            ],
            name: 'burn',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        address: W_MASS_ADDRESS,
        functionName: 'burn',
        args: [amount, massaAddress],
      });
    },
    [writeContract, W_MASS_ADDRESS],
  );

  const { isSuccess, data } = useWaitForTransactionReceipt({
    hash,
    confirmations: bscMinConfirmations,
  });

  // Add rejection handling
  useEffect(() => {
    if (hash) {
      setBurnHash(hash);
    }
    if (isSuccess && data) {
      setIsBurnSuccess(true);
    }

    if (burnWriteError) {
      const typedError = burnWriteError as CustomError;
      if (isRejectedByUser(typedError)) {
        toast.error(Intl.t('index.burn.error.rejected'));
      } else {
        toast.error(Intl.t('index.burn.error.unknown'));
        console.error(burnWriteError);
      }
    }
  }, [isSuccess, burnWriteError, hash, setIsBurnSuccess, setBurnHash, data]);

  return { write, isBurnSuccess, burnHash, isBurnWriteError };
}
