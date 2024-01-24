import { Client } from '@massalabs/massa-web3';
import { toast } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';

import { BridgeMode, U256_MAX } from '../../../const/const';
import { LoadingState } from '../../../const/types/types';
import Intl from '../../../i18n/i18n';
import { IToken } from '../../../store/tokenStore';
import { increaseAllowance } from '../bridge';
import {
  CustomError,
  isInsufficientBalanceError,
  isRejectedByUser,
} from '@/utils/error';

export async function handleApproveRedeem(
  mode: BridgeMode,
  client: Client,
  setLoading: (state: LoadingState) => void,
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
      await increaseAllowance(mode, client, token.massaToken, U256_MAX);
    }

    setLoading({
      approve: 'success',
    });
  } catch (error: any) {
    const typedError = error as CustomError;
    const isErrorTimeout =
      typedError.cause && typedError.cause.error === 'timeout';
    if (isInsufficientBalanceError(error)) {
      toast.error(Intl.t('index.approve.error.insufficient-funds'));
    } else if (isRejectedByUser(typedError)) {
      toast.error(Intl.t('index.approve.error.rejected'));
    } else if (isErrorTimeout) {
      // if there is timeout during waitIncludedOperation
      toast.error(Intl.t('index.approve.error.timeout'));
    } else {
      // error during allowance increase
      toast.error(Intl.t('index.approve.error.allowance-error'));
    }
    setLoading({
      box: 'error',
      approve: 'error',
    });
    return false;
  }
  return true;
}
