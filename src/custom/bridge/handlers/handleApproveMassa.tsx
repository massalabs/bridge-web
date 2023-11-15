import { Client } from '@massalabs/massa-web3';
import { parseUnits } from 'viem';

import { handleErrorMessage } from './handleErrorMessage';
import { U256_MAX } from '../../../const/const';
import { ILoadingState } from '../../../const/types/types';
import { IToken } from '../../../store/accountStore';
import { increaseAllowance } from '../bridge';

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

    return true;
  } catch (error) {
    if (error) {
      console.error(error);
      setLoading({
        box: 'error',
        approve: 'error',
        burn: 'error',
        redeem: 'error',
      });
    }

    handleErrorMessage(error as Error, setLoading, setRedeemSteps, setAmount);

    return false;
  }
}
