import { Client } from '@massalabs/massa-web3';
import { parseUnits } from 'viem';

// import { handleErrorMessage } from './handleErrorMessage';
import { U256_MAX } from '../../../const/const';
import { IToken } from '../../../store/accountStore';
import { increaseAllowance } from '../bridge';

export async function handleApproveMASSA(
  client: Client,
  setApproveState: (state: string) => void,
  // setRedeemSteps: (state: string) => void,
  // setAmount: (state: string) => void,
  token: IToken | null,
  amount: string | undefined,
  decimals: number,
) {
  try {
    setApproveState('loading');

    if (!token || !amount) {
      throw new Error('Missing param');
    }

    let _amount = parseUnits(amount, decimals);

    if (token.allowance < _amount) {
      await increaseAllowance(client, token.massaToken, U256_MAX);
    }
    setApproveState('success');

    return true;
  } catch (error) {
    setApproveState('error');
    // handleErrorMessage(error as Error, setLoading, setRedeemSteps, setAmount);
    return false;
  }
}
