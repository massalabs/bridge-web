import { toast } from '@massalabs/react-ui-kit';
import delay from 'delay';
import { STATUS_POLL_INTERVAL_MS, WAIT_STATUS_TIMEOUT } from '@/const';
import Intl from '@/i18n/i18n';
import { CustomError, isRejectedByUser } from '@/utils/error';

// TODO: complete handleBridge logic

// Keeping commented artefacts for now so I can have a reference

export async function handleWMASBridge(burnHash: `0x${string}` | undefined) {
  if (!burnHash) return;

  try {
    const redeemMASOpId = await waitForMASRedeem(burnHash);
    console.log(redeemMASOpId);
    // setRedeemMASOpId(redeemMASOpId);
    // setRedeemMAS(Status.Success);
    // setBox(Status.Success);
  } catch (error) {
    handleRedeemMASError(error as CustomError);
  }
}

async function waitForMASRedeem(burnWMASTxId: string): Promise<string> {
  const start = Date.now();
  let counterMs = 0;
  console.log('waitForMASRedeem');

  while (counterMs < WAIT_STATUS_TIMEOUT) {
    console.log('timeout loop started');

    // TODO: fetch lambda

    const found = false;
    if (found) {
      console.log('found');
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
  // const { setBox, setRedeemMAS } = useGlobalStatusesStore.getState();
  const isTimeout = error.cause?.error === 'timeout';

  if (isTimeout) {
    // setBox(Status.Warning);
    // setRedeemMAS(Status.Warning);
  } else {
    console.error(error);
    // setRedeemMAS(Status.Error);
  }
}
