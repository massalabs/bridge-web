import { Client, EOperationStatus, IEvent } from '@massalabs/massa-web3';

export const waitOperationEvents = async (
  client: Client,
  opId: string,
): Promise<IEvent[]> => {
  await client
    .smartContracts()
    .awaitRequiredOperationStatus(opId, EOperationStatus.FINAL);

  return client.smartContracts().getFilteredScOutputEvents({
    emitter_address: null,
    start: null,
    end: null,
    original_caller_address: null,
    original_operation_id: opId,
    is_final: true,
  });
};
