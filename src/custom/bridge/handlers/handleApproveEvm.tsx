import { parseUnits } from 'viem';

import { handleErrorMessage } from './handleErrorMessage';
import { ILoadingState } from '@/const';
import useEvmBridge from '@/custom/bridge/useEvmBridge';

export async function handleApproveEVM(
  setLoading: (state: ILoadingState) => void,
  setRedeemSteps: (state: string) => void,
  setAmount: (state: string) => void,
  amount: string | undefined,
  decimals: number,
) {
  const { handleApprove: _handleApproveEVM, allowance: _allowanceEVM } =
    useEvmBridge();
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

    if (error)
      handleErrorMessage(error as Error, setLoading, setRedeemSteps, setAmount);

    return false;
  }

  return true;
}
