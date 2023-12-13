import { Client } from '@massalabs/massa-web3';
import { toast } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';

import { U256_MAX } from '../../../const/const';
import { ILoadingState } from '../../../const/types/types';
import Intl from '../../../i18n/i18n';
import { IToken } from '../../../store/accountStore';
import { increaseAllowance } from '../bridge';
import { ICustomError, regexErr, regexWarn } from '@/utils/const';

export async function handleApproveRedeem(
  client: Client,
  setLoading: (state: ILoadingState) => void,
  token: IToken,
  amount: string,
  decimals: number,
) {
  try {
    setLoading({
      approve: 'loading',
    });

    let _amount = parseUnits(amount, decimals);

    if (token.allowance < _amount) {
      await increaseAllowance(client, token.massaToken, U256_MAX);
    }

    setLoading({
      approve: 'success',
    });
  } catch (error) {
    const typedError = error as ICustomError;
    const isErrorTimeout = typedError.cause?.error === 'timeout';
    if (
      regexErr.test(typedError.toString()) ||
      regexWarn.test(typedError.toString())
    ) {
      // user rejects operation
      toast.error(Intl.t(`index.approve.error.rejected`));
    } else if (isErrorTimeout) {
      // if there is timeout during waitIncludedOperation
      toast.error(Intl.t(`index.approve.error.timeout`));
    } else {
      // error during allowance increase
      toast.error(Intl.t(`index.approve.error.allowance-error`));
    }
    setLoading({
      box: 'error',
      approve: 'error',
    });
    return false;
  }
  return true;
}
