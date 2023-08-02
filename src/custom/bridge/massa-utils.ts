import { Client, EOperationStatus, IEvent } from '@massalabs/massa-web3';

export async function waitOperationEvents(
  client: Client,
  opId: string,
): Promise<IEvent[]> {
  await client
    .smartContracts()
    .awaitRequiredOperationStatus(opId, EOperationStatus.INCLUDED_PENDING);

  const events = await client.smartContracts().getFilteredScOutputEvents({
    emitter_address: null,
    start: null,
    end: null,
    original_caller_address: null,
    original_operation_id: opId,
    is_final: null,
  });

  if (events.some((e) => e.context.is_error)) {
    events.map((l) => console.log(`>>>> ${l.data}`));
    throw new Error(`Waiting for operation ${opId} ended with error:`);
  }
  return events;
}
