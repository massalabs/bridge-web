import { toast } from '@massalabs/react-ui-kit';
import Intl from '../../../i18n/i18n';
import { forwardBurn } from '../bridge';
import { waitIncludedOperation } from '../massa-utils';
import { Status, GlobalStatusesStoreState } from '@/store/globalStatusesStore';
import { CustomError, isRejectedByUser } from '@/utils/error';

export interface BurnRedeemParams {
  recipient: `0x${string}`;
  amount: string;
  setBurnTxID: (state: string) => void;
  setRedeemSteps: (state: string) => void;
  globalStatusesStore: GlobalStatusesStoreState;
}

export async function handleBurnRedeem(
  args: BurnRedeemParams,
): Promise<boolean> {
  const { globalStatusesStore } = args;
  try {
    await initiateBurn(args);
  } catch (error) {
    handleBurnError(args, error);
    globalStatusesStore.setBox(Status.Error);
    globalStatusesStore.setBurn(Status.Error);
    return false;
  }
  return true;
}

async function initiateBurn({
  recipient,
  amount,
  setBurnTxID,
  setRedeemSteps,
  globalStatusesStore,
}: BurnRedeemParams) {
  globalStatusesStore.setBurn(Status.Loading);

  setRedeemSteps(Intl.t('index.loading-box.awaiting-inclusion'));

  const operationId = await forwardBurn(recipient, amount);

  setBurnTxID(operationId);

  setRedeemSteps(Intl.t('index.loading-box.included-pending'));

  await waitIncludedOperation(operationId);

  globalStatusesStore.setBurn(Status.Success);

  setRedeemSteps(Intl.t('index.loading-box.burned-final'));
}

function handleBurnError(args: BurnRedeemParams, error: undefined | unknown) {
  const { setRedeemSteps } = args;

  const typedError = error as CustomError;
  const isErrorTimeout = typedError.cause?.error === 'timeout';
  if (isRejectedByUser(typedError)) {
    toast.error(Intl.t('index.burn.error.rejected'));
    setRedeemSteps(Intl.t('index.loading-box.burn-rejected'));
  } else if (isErrorTimeout) {
    toast.error(Intl.t('index.burn.error.timeout'));
  } else {
    toast.error(Intl.t('index.burn.error.unknown'));
    console.error(error);
  }
}
