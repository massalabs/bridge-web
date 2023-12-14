import { Client } from '@massalabs/massa-web3';
import { toast } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';

import Intl from '../../../i18n/i18n';
import { forwardBurn } from '../bridge';
import { waitIncludedOperation } from '../massa-utils';
import { ILoadingState } from '@/const';
import { TokenPair } from '@/custom/serializable/tokenPair';
import { IToken } from '@/store/accountStore';
import { CustomError, isRejectedByUser } from '@/utils/error';

export async function handleBurnRedeem(
  client: Client,
  token: IToken,
  evmAddress: `0x${string}`,
  amount: string,
  decimals: number,
  EVMOperationID: React.MutableRefObject<string | undefined>,
  setLoading: (state: ILoadingState) => void,
  setRedeemSteps: (state: string) => void,
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
    const typedError = error as CustomError;
    const isErrorTimeout =
      typedError.cause && typedError.cause.error === 'timeout';
    if (isRejectedByUser(typedError)) {
      toast.error(Intl.t(`index.burn.error.rejected`));
      setRedeemSteps(Intl.t('index.loading-box.burn-rejected'));
    } else if (isErrorTimeout) {
      // if there is timeout during waitIncludedOperation
      toast.error(Intl.t(`index.burn.error.timeout`));
    } else {
      console.error(error);
    }
    setLoading({ box: 'error', burn: 'error' });
    return false;
  }
  return true;
}
