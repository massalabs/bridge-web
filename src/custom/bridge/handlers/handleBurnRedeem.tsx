import { toast } from '@massalabs/react-ui-kit';
import Intl from '../../../i18n/i18n';
import { forwardBurn } from '../bridge';
import { waitIncludedOperation } from '../massa-utils';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useOperationStore } from '@/store/store';
import { ClaimSteps } from '@/utils/const';
import {
  CustomError,
  isRejectedByUser,
  isWalletTimeoutError,
} from '@/utils/error';

export interface BurnRedeemParams {
  recipient: `0x${string}`;
  amount: string;
}

export async function handleBurnRedeem(
  args: BurnRedeemParams,
): Promise<boolean> {
  const { setBurn, setBox } = useGlobalStatusesStore.getState();

  try {
    await initiateBurn(args);
  } catch (error) {
    handleBurnError(error);
    setBox(Status.Error);
    setBurn(Status.Error);
    return false;
  }
  return true;
}

async function initiateBurn({ recipient, amount }: BurnRedeemParams) {
  const { setBurn } = useGlobalStatusesStore.getState();
  const { setBurnTxId, setCurrentRedeemOperation } =
    useOperationStore.getState();
  const { setRedeemLabels } = useGlobalStatusesStore.getState();

  setBurn(Status.Loading);

  setRedeemLabels({ burn: Intl.t('index.loading-box.awaiting-inclusion') });

  const burnOpId = await forwardBurn(recipient, amount);
  setBurnTxId(burnOpId);
  setCurrentRedeemOperation({
    inputOpId: burnOpId,
    claimStep: ClaimSteps.None,
    signatures: [],
  });

  setRedeemLabels({ burn: Intl.t('index.loading-box.included-pending') });
  await waitIncludedOperation(burnOpId);

  setBurn(Status.Success);
  setRedeemLabels({
    burn: Intl.t('index.loading-box.burn-final'),
    claim: Intl.t('index.loading-box.claim-step-retrieving-info'),
  });
}

function handleBurnError(error: undefined | unknown) {
  const { setRedeemLabels } = useGlobalStatusesStore.getState();
  const typedError = error as CustomError;
  const isErrorTimeout = typedError.cause?.error === 'timeout';
  if (isRejectedByUser(typedError)) {
    toast.error(Intl.t('index.burn.error.rejected'));
    setRedeemLabels({ burn: Intl.t('index.loading-box.burn-rejected') });
  } else if (isWalletTimeoutError(typedError)) {
    toast.error(Intl.t('index.burn.error.timeout'));
    setRedeemLabels({
      burn: Intl.t('index.loading-box.burn-signature-timeout'),
    });
  } else if (isErrorTimeout) {
    toast.error(Intl.t('index.burn.error.timeout'));
  } else {
    toast.error(Intl.t('index.burn.error.unknown'));
    console.error(error);
  }
}
