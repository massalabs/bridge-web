import { Client } from '@massalabs/massa-web3';

import { handleErrorMessage } from './handleErrorMessage';
import { increaseAllowance } from '../bridge';
import { parseUnits } from '../massa-utils';
import { ILoadingState, U256_MAX } from '@/const';
import { IToken } from '@/store/accountStore';

export async function handleApproveMASSA(
  client: Client,
  setLoading: (state: ILoadingState) => void,
  setRedeemSteps: (state: string) => void,
  setAmount: (state: string) => void,
  token: IToken | null,
  amount: string | undefined,
  decimals: number,
) {
  try {
    setLoading({
      approve: 'loading',
    });

    if (!token || !amount) {
      throw new Error('Missing param');
    }

    let _amount = parseUnits(amount, decimals);

    if (token.allowance < _amount) {
      await increaseAllowance(client, token.massaToken, U256_MAX);
    }

    setLoading({
      approve: 'success',
    });
  } catch (error) {
    setLoading({
      box: 'error',
      approve: 'error',
      burn: 'error',
      redeem: 'error',
    });

    if (error)
      handleErrorMessage(error as Error, setLoading, setRedeemSteps, setAmount);
    return false;
  }
  return true;
}
