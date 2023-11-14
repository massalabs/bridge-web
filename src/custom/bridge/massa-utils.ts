import { Client, EOperationStatus, IEvent } from '@massalabs/massa-web3';
import delay from 'delay';

import { CONTRACT_ADDRESS } from '@/const';
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
    const status = await getOperationStatus(client, opId);
    const {
      FINAL_ERROR,
      SPECULATIVE_SUCCESS,
      FINAL_SUCCESS,
      SPECULATIVE_ERROR,
    } = EOperationStatus;

    if (
      (status === SPECULATIVE_SUCCESS && !onlyFinal) ||
      status === FINAL_SUCCESS
    ) {
      return;
    }
    if ([FINAL_ERROR, SPECULATIVE_ERROR].includes(status)) {
      const events = await getOperationEvents(client, opId);
      events.map((l) =>
        console.error(`opId ${opId}: execution error ${l.data}`),
      );
      throw new Error(`Waiting for operation ${opId} ended with errors`);
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
        console.error(err);
        return false;
      }
      return true;
    }
    await delay(STATUS_POLL_INTERVAL_MS);
    counterMs = Date.now() - start;
  }
  throw new Error(`Fail to wait bridge process finality lock tx ${lockTxId}`, {
    cause: { error: 'timeout', details: lockTxId },
  });
}

export function parseUnits(value: string, decimals: number) {
  let [integer, fraction = '0'] = value.split('.');

  const negative = integer.startsWith('-');
  if (negative) integer = integer.slice(1);

  // trim leading zeros.
  fraction = fraction.replace(/(0+)$/, '');

  // round off if the fraction is larger than the number of decimals.
  if (decimals === 0) {
    if (Math.round(Number(`.${fraction}`)) === 1)
      integer = `${BigInt(integer) + 1n}`;
    fraction = '';
  } else if (fraction.length > decimals) {
    const [left, unit, right] = [
      fraction.slice(0, decimals - 1),
      fraction.slice(decimals - 1, decimals),
      fraction.slice(decimals),
    ];

    const rounded = Math.round(Number(`${unit}.${right}`));
    if (rounded > 9)
      fraction = `${BigInt(left) + BigInt(1)}0`.padStart(left.length + 1, '0');
    else fraction = `${left}${rounded}`;

    if (fraction.length > decimals) {
      fraction = fraction.slice(1);
      integer = `${BigInt(integer) + 1n}`;
    }

    fraction = fraction.slice(0, decimals);
  } else {
    fraction = fraction.padEnd(decimals, '0');
  }

  return BigInt(`${negative ? '-' : ''}${integer}${fraction}`);
}
