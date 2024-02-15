import { toast } from '@massalabs/react-ui-kit';
import Intl from '../../../i18n/i18n';
import { forwardBurn } from '../bridge';
import { waitIncludedOperation } from '../massa-utils';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useOperationStore } from '@/store/store';
import { ClaimState, ClaimSteps } from '@/utils/const';
import {
  CustomError,
  isRejectedByUser,
  isWalletTimeoutError,
} from '@/utils/error';

export interface BurnRedeemParams {
  recipient: `0x${string}`;
  amount: string;
  setRedeemSteps: (state: string) => void;
}

export async function handleBurnRedeem(
  args: BurnRedeemParams,
): Promise<boolean> {
  const { setBurn, setBox } = useGlobalStatusesStore.getState();

  try {
    await initiateBurn(args);
  } catch (error) {
    handleBurnError(args, error);
    setBox(Status.Error);
    setBurn(Status.Error);
    return false;
  }
  return true;
}

async function initiateBurn({
  recipient,
  amount,
  setRedeemSteps,
}: BurnRedeemParams) {
  const { setBurn } = useGlobalStatusesStore.getState();
  const { setBurnTxId, setCurrentRedeemOperation } =
    useOperationStore.getState();
  const { updateCurrentRedeemOperation } = useOperationStore.getState();

  setBurn(Status.Loading);

  setRedeemSteps(Intl.t('index.loading-box.awaiting-inclusion'));

  const burnOpId = await forwardBurn(recipient, amount);
  setBurnTxId(burnOpId);
  setCurrentRedeemOperation({
    inputOpId: burnOpId,
    claimStep: ClaimSteps.None,
    signatures: [],
    state: ClaimState.INIT,
  });

  setRedeemSteps(Intl.t('index.loading-box.included-pending'));
  await waitIncludedOperation(burnOpId);

  setBurn(Status.Success);

  setRedeemSteps(Intl.t('index.loading-box.burned-final'));

  updateCurrentRedeemOperation({
    claimStep: ClaimSteps.RetrievingInfo,
  });
}

function handleBurnError(args: BurnRedeemParams, error: undefined | unknown) {
  const { setRedeemSteps } = args;

  const typedError = error as CustomError;
  const isErrorTimeout = typedError.cause?.error === 'timeout';
  if (isRejectedByUser(typedError)) {
    toast.error(Intl.t('index.burn.error.rejected'));
    setRedeemSteps(Intl.t('index.loading-box.burn-rejected'));
  } else if (isWalletTimeoutError(typedError)) {
    toast.error(Intl.t('index.burn.error.timeout'));
    setRedeemSteps(Intl.t('index.loading-box.burn-signature-timeout'));
  } else if (isErrorTimeout) {
    toast.error(Intl.t('index.burn.error.timeout'));
  } else {
    toast.error(Intl.t('index.burn.error.unknown'));
    console.error(error);
  }
}
