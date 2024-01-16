import { Client, EOperationStatus, IEvent } from '@massalabs/massa-web3';
import delay from 'delay';

import { BridgeMode, config } from '@/const';
import { safeJsonParse } from '@/utils/utils';

const WAIT_STATUS_TIMEOUT = 300_000;
const STATUS_POLL_INTERVAL_MS = 1000;

async function getOperationStatus(
  client: Client,
  opId: string,
): Promise<EOperationStatus> {
  return client.smartContracts().getOperationStatus(opId);
}

async function getOperationEvents(
  client: Client,
  opId: string,
): Promise<IEvent[]> {
  return client.smartContracts().getFilteredScOutputEvents({
    emitter_address: null,
    start: null,
    end: null,
    original_caller_address: null,
    original_operation_id: opId,
    is_final: null,
  });
}

export async function waitIncludedOperation(
  client: Client,
  opId: string,
  onlyFinal = false,
): Promise<void> {
  const start = Date.now();
  let counterMs = 0;
  while (counterMs < WAIT_STATUS_TIMEOUT) {
    const opStatus = await checkForOperationStatus(client, opId, onlyFinal);

    if (opStatus) {
      return;
    }

    await delay(STATUS_POLL_INTERVAL_MS);
    counterMs = Date.now() - start;
  }
  const status = await getOperationStatus(client, opId);
  throw new Error(
    `Fail to wait operation finality for ${opId}: Timeout reached. status: ${status}`,
    { cause: { error: 'timeout', details: opId } },
  );
}

export async function checkForOperationStatus(
  client: Client,
  opId: string,
  onlyFinal = false,
): Promise<boolean> {
  const status = await getOperationStatus(client, opId);
  const { FINAL_ERROR, SPECULATIVE_SUCCESS, FINAL_SUCCESS, SPECULATIVE_ERROR } =
    EOperationStatus;
  if (
    (status === SPECULATIVE_SUCCESS && !onlyFinal) ||
    status === FINAL_SUCCESS
  ) {
    return true;
  }
  if ([FINAL_ERROR, SPECULATIVE_ERROR].includes(status)) {
    const events = await getOperationEvents(client, opId);
    events.map((l) => console.error(`opId ${opId}: execution error ${l.data}`));
    throw new Error(`Waiting for operation ${opId} ended with errors`);
  }
  return false;
}

function isTokenMintedEvent(event: IEvent, lockTxId: string) {
  const eventData = safeJsonParse(event.data);
  if (!eventData) {
    return false;
  }
  return (
    eventData?.eventName === 'TOKEN_MINTED' && eventData?.txId === lockTxId
  );
}

export async function waitForMintEvent(
  mode: BridgeMode,
  client: Client,
  lockTxId: string,
): Promise<boolean> {
  const start = Date.now();
  let counterMs = 0;

  while (counterMs < WAIT_STATUS_TIMEOUT) {
    const events = await client.smartContracts().getFilteredScOutputEvents({
      emitter_address: config[mode].massaBridgeContract,
      start: null,
      end: null,
      original_caller_address: null,
      original_operation_id: null,
      is_final: true,
    });

    const mintEvent = events.find((e) => isTokenMintedEvent(e, lockTxId));
    if (mintEvent) {
      try {
        await checkForOperationStatus(
          client,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          mintEvent.context.origin_operation_id!,
        );
      } catch (err) {
        console.error(err);
        return false;
      }
      return true;
    }
  }
  await delay(STATUS_POLL_INTERVAL_MS);
  counterMs = Date.now() - start;

  throw new Error(`Fail to wait bridge process finality lock tx ${lockTxId}`, {
    cause: { error: 'timeout', details: lockTxId },
  });
}
