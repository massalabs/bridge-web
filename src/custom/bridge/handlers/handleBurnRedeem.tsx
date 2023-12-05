import { Client } from '@massalabs/massa-web3';
import { parseUnits } from 'viem';

import { handleErrorMessage } from './handleErrorMessage';
import Intl from '../../../i18n/i18n';
import { forwardBurn } from '../bridge';
import { waitIncludedOperation } from '../massa-utils';
import { ILoadingState } from '@/const';
import { TokenPair } from '@/custom/serializable/tokenPair';
import { IToken } from '@/store/accountStore';

export async function handleBurnRedeem(
  client: Client,
  token: IToken,
  evmAddress: `0x${string}`,
  amount: string,
  decimals: number,
  EVMOperationID: React.MutableRefObject<string | undefined>,
  setLoading: (state: ILoadingState) => void,
  setRedeemSteps: (state: string) => void,
  setAmount: (state: string) => void,
) {
  try {
    const tokenPair = new TokenPair(
      token.massaToken,
      token.evmToken,
      token.chainId,
    );

    setLoading({
      burn: 'loading',
    });

    setRedeemSteps(Intl.t('index.loading-box.awaiting-inclusion'));

    const operationId = await forwardBurn(
      client,
      evmAddress,
      tokenPair,
      parseUnits(amount, decimals),
    );

    EVMOperationID.current = operationId;

    setRedeemSteps(Intl.t('index.loading-box.included-pending'));

    await waitIncludedOperation(client, operationId);

    setLoading({
      burn: 'success',
      redeem: 'loading',
    });
    setRedeemSteps(Intl.t('index.loading-box.burned-final'));
  } catch (error) {
    handleErrorMessage(error as Error, setLoading, setRedeemSteps, setAmount);
    return false;
  }
  return true;
}
