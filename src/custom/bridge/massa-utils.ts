import { Client, EOperationStatus, IEvent } from '@massalabs/massa-web3';
import delay from 'delay';

import { CONTRACT_ADDRESS } from '@/const';
import { safeJsonParse } from '@/utils/utils';

const WAIT_STATUS_TIMEOUT = 120_000;
const STATUS_POLL_INTERVAL_MS = 1000;

async function getOperationStatus(
  client: Client,
  opId: string,
): Promise<EOperationStatus> {
  return client.smartContracts().getOperationStatus(opId);
}

async function isOperationIncluded(
  client: Client,
  opId: string,
): Promise<boolean> {
  const status = await getOperationStatus(client, opId);
  return (
    status === EOperationStatus.INCLUDED_PENDING ||
    status === EOperationStatus.FINAL
  );
}

async function isOperationFinal(
  client: Client,
  opId: string,
): Promise<boolean> {
  const status = await getOperationStatus(client, opId);
  return status === EOperationStatus.FINAL;
}

export async function waitIncludedOperation(
  client: Client,
  opId: string,
  onlyFinal = false,
): Promise<void> {
  const start = Date.now();
  let counterMs = 0;
  while (counterMs < WAIT_STATUS_TIMEOUT) {
    const done = onlyFinal
      ? await isOperationFinal(client, opId)
      : await isOperationIncluded(client, opId);
    if (done) {
      const events = await client.smartContracts().getFilteredScOutputEvents({
        emitter_address: null,
        start: null,
        end: null,
        original_caller_address: null,
        original_operation_id: opId,
        is_final: true,
      });
      if (events.some((e) => e.context.is_error)) {
        events.map((l) => console.log(`>>>> ${l.data}`));
        throw new Error(`Waiting for operation ${opId} ended with errors`);
      }
      return;
    }
    await delay(STATUS_POLL_INTERVAL_MS);
    counterMs = Date.now() - start;
  }
  const status = await client.smartContracts().getOperationStatus(opId);
  throw new Error(
    `Fail to wait operation finality for ${opId}: Timeout reached. status: ${status}`,
  );
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
  client: Client,
  lockTxId: string,
): Promise<boolean> {
  const start = Date.now();
  let counterMs = 0;
  while (counterMs < WAIT_STATUS_TIMEOUT) {
    const events = await client.smartContracts().getFilteredScOutputEvents({
      emitter_address: null,
      start: null,
      end: null,
      original_caller_address: CONTRACT_ADDRESS,
      original_operation_id: null,
      is_final: true,
    });
    const mintEvent = events.find((e) => isTokenMintedEvent(e, lockTxId));
    if (mintEvent) {
      try {
        await waitIncludedOperation(
          client,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          mintEvent.context.origin_operation_id!,
        );
      } catch (err) {
        console.log(err);
        return false;
      }
      return true;
    }
    await delay(STATUS_POLL_INTERVAL_MS);
    counterMs = Date.now() - start;
  }
  throw new Error(
    `Fail to wait bridge process finality lock tx ${lockTxId}: Timeout reached.`,
  );
}
