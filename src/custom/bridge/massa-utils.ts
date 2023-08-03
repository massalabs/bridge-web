import { Client, EOperationStatus } from '@massalabs/massa-web3';
import delay from "delay"

const WAIT_STATUS_TIMEOUT = 120_000;
const STATUS_POLL_INTERVAL_MS = 1000;

async function getOperationStatus(client: Client,opId: string): Promise<EOperationStatus> {
  return client.smartContracts().getOperationStatus(opId);
}

async function isOperationIncluded(client: Client,opId: string): Promise<boolean> {
  const status = await getOperationStatus(client, opId);
  return status === EOperationStatus.INCLUDED_PENDING || status === EOperationStatus.FINAL;
}

export async function waitIncludedOperation(client: Client, opId: string): Promise<void> {
  const start = Date.now();
  let counterMs = 0;
  while (counterMs < WAIT_STATUS_TIMEOUT) {
      if (await isOperationIncluded(client, opId)) {
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