import { Client } from '@massalabs/massa-web3';
import { toast } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';

import Intl from '../../../i18n/i18n';
import { forwardBurn } from '../bridge';
import { waitIncludedOperation } from '../massa-utils';
import { BridgeMode, LoadingState } from '@/const';
import { TokenPair } from '@/custom/serializable/tokenPair';
import { IToken } from '@/store/tokenStore';
import { CustomError, isRejectedByUser } from '@/utils/error';

export interface BurnRedeemParams {
  mode: BridgeMode;
  client: Client;
  token: IToken;
  recipient: `0x${string}`;
  amount: string;
  decimals: number;
  setBurnTxID: (state: string) => void;
  setLoading: (state: LoadingState) => void;
  setRedeemSteps: (state: string) => void;
}

export async function handleBurnRedeem(
  args: BurnRedeemParams,
): Promise<boolean> {
  const { setLoading } = args;
  try {
    await initiateBurn({ ...args });
  } catch (error) {
    handleBurnError({ ...args }, error);
    setLoading({ box: 'error', burn: 'error' });
    return false;
  }
  return true;
}

async function initiateBurn({
  mode,
  client,
  token,
  recipient,
  amount,
  decimals,
  setBurnTxID,
  setLoading,
  setRedeemSteps,
}: BurnRedeemParams) {
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
    mode,
    client,
    recipient,
    tokenPair,
    parseUnits(amount, decimals),
  );

  setBurnTxID(operationId);

  setRedeemSteps(Intl.t('index.loading-box.included-pending'));

  await waitIncludedOperation(client, operationId);

  setLoading({
    burn: 'success',
  });

  setRedeemSteps(Intl.t('index.loading-box.burned-final'));
}

function handleBurnError({ ...args }, error: undefined | unknown) {
  const { setRedeemSteps } = args;

  const typedError = error as CustomError;
  const isErrorTimeout = typedError.cause?.error === 'timeout';
  if (isRejectedByUser(typedError)) {
    toast.error(Intl.t(`index.burn.error.rejected`));
    setRedeemSteps(Intl.t('index.loading-box.burn-rejected'));
  } else if (isErrorTimeout) {
    toast.error(Intl.t(`index.burn.error.timeout`));
  } else {
    toast.error(Intl.t(`index.burn.error.unknown`));
    console.error(error);
  }
}
