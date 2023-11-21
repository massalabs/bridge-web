import { parseUnits } from 'viem';

import { handleErrorMessage } from './handleErrorMessage';
import { ILoadingState } from '@/const';

export async function handleLockBridge(
  setLoading: (state: ILoadingState) => void,
  setRedeemSteps: (state: string) => void,
  setAmount: (state: string) => void,
  amount: string | undefined,
  _handleLockEVM: any,
  decimals: number,
) {
  setLoading({ lock: 'loading' });

  try {
    if (!amount) {
      throw new Error('Missing param');
    }
    await _handleLockEVM(parseUnits(amount, decimals));
  } catch (error) {
    setLoading({ box: 'error', lock: 'error', mint: 'error' });
    handleErrorMessage(error as Error, setLoading, setRedeemSteps, setAmount);
    return false;
  }
  return true;
}
