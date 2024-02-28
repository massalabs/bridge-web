import { toast } from '@massalabs/react-ui-kit';
import delay from 'delay';
import { STATUS_POLL_INTERVAL_MS, WAIT_STATUS_TIMEOUT } from '@/const';
import Intl from '@/i18n/i18n';
import { Status } from '@/store/globalStatusesStore';
import { useOperationStore, useGlobalStatusesStore } from '@/store/store';
import { CustomError, isRejectedByUser } from '@/utils/error';

export async function handleWMASBridge() {
  const { setBox, setRedeemMAS } = useGlobalStatusesStore.getState();
  const { burnWMASTxId, setRedeemMASOpId } = useOperationStore.getState();
  if (!burnWMASTxId) return;

  try {
    const redeemMASOpId = await waitForMASRedeem(burnWMASTxId);
    setRedeemMASOpId(redeemMASOpId);
    setRedeemMAS(Status.Success);
    setBox(Status.Success);
  } catch (error) {
    handleRedeemMASError(error as CustomError);
  }
}

async function waitForMASRedeem(burnWMASTxId: string): Promise<string> {
  const start = Date.now();
  let counterMs = 0;

  while (counterMs < WAIT_STATUS_TIMEOUT) {
    // TODO: fetch lambda
    if ('found') {
      return 'redeemMASOpId';
    }

    await delay(STATUS_POLL_INTERVAL_MS);
    counterMs = Date.now() - start;
  }

  throw new Error(
    `Fail to wait bridge process finality redeem MAS, burn tx: ${burnWMASTxId}`,
    {
      cause: { error: 'timeout', details: burnWMASTxId },
    },
  );
}

export function handleBurnWMASError(error: Error) {
  if (isRejectedByUser(error)) {
    toast.error(Intl.t('index.burn.error.rejected'), { id: error.message });
  } else {
    toast.error(Intl.t('index.burn.error.unknown'), { id: error.message });
    console.error(error);
  }
}

function handleRedeemMASError(error: CustomError) {
  const { setBox, setRedeemMAS } = useGlobalStatusesStore.getState();
  const isTimeout = error.cause?.error === 'timeout';

  if (isTimeout) {
    setBox(Status.Warning);
    setRedeemMAS(Status.Warning);
  } else {
    console.error(error);
    setRedeemMAS(Status.Error);
  }
}
