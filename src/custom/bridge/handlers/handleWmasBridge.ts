import { toast } from '@massalabs/react-ui-kit';
import delay from 'delay';
import { STATUS_POLL_INTERVAL_MS, WAIT_STATUS_TIMEOUT, config } from '@/const';
import Intl from '@/i18n/i18n';
import { useBridgeModeStore } from '@/store/store';
import { CustomError, isRejectedByUser } from '@/utils/error';
import { Entities, lambdaEndpoint } from '@/utils/lambdaApi';

// TODO: complete handleBridge logic

// Keeping commented artefacts for now so I can have a reference

export async function handleWMASBridge(
  burnHash: `0x${string}` | undefined,
  evmAddress: `0x${string}` | undefined,
) {
  if (!burnHash) return;

  try {
    const redeemMASOpId = await waitForMASRedeem(burnHash, evmAddress);
    console.log(redeemMASOpId);
    // setRedeemMASOpId(redeemMASOpId);
    // setRedeemMAS(Status.Success);
    // setBox(Status.Success);
  } catch (error) {
    handleRedeemMASError(error as CustomError);
  }
}

async function waitForMASRedeem(
  burnWmasTxId: string,
  evmAddress: `0x${string}` | undefined,
): Promise<string> {
  const start = Date.now();
  let counterMs = 0;
  console.log('waitForMASRedeem');
  const { currentMode } = useBridgeModeStore.getState();

  while (counterMs < WAIT_STATUS_TIMEOUT) {
    console.log('timeout loop started');

    // TEMP const
    const inputLogIdx = 0;

    /* eslint-disable max-len */
    const queryParams = `?evmAddress=${evmAddress}&inputTxId=${burnWmasTxId}&entities=${Entities.ReleaseMAS}&inputLogIdx=${inputLogIdx}`;
    const lambdaUrl = `${config[currentMode].lambdaUrl}${lambdaEndpoint}${queryParams}`;

    console.log('lambdaUrl', lambdaUrl);
    fetch(lambdaUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });

    const found = false;
    if (found) {
      console.log('found');
      return 'redeemMASOpId';
    }

    await delay(STATUS_POLL_INTERVAL_MS);
    counterMs = Date.now() - start;
  }

  throw new Error(
    `Fail to wait bridge process finality redeem MAS, burn tx: ${burnWmasTxId}`,
    {
      cause: { error: 'timeout', details: burnWmasTxId },
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
