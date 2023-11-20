import { parseUnits } from 'viem';

import { ICustomError, handleErrorMessage } from './handleErrorMessage';
import { ILoadingState } from '@/const';

export async function handleApproveBridge(
  setLoading: (state: ILoadingState) => void,
  setRedeemSteps: (state: string) => void,
  setAmount: (state: string) => void,
  amount: string | undefined,
  decimals: number,
  _handleApproveEVM: any,
  _allowanceEVM: bigint,
): Promise<boolean> {
  try {
    setLoading({ approve: 'loading' });

    if (!amount) {
      return false;
    }

    let _amount = parseUnits(amount, decimals);

    if (_allowanceEVM < _amount) {
      await _handleApproveEVM();
      return false;
    }
    setLoading({ approve: 'success' });
  } catch (error) {
    setLoading({
      box: 'error',
      approve: 'error',
      lock: 'error',
      mint: 'error',
    });
    handleErrorMessage(
      error as ICustomError,
      setLoading,
      setRedeemSteps,
      setAmount,
    );
    return false;
  }
  return true;
}
