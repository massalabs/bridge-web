import {
  Burned,
  Signatures,
} from '@/pages/Index/Layouts/LoadingLayout/RedeemLayout/InterfaceApi';

interface ClaimArgs {
  response: Burned[] | undefined;
  operationId: string | undefined;
}

// This function checks if there is an operation that has not been redeemed yet
// Conditions for return: state = processing, outputTxId = null, burnId = txHash
export async function checkBurnedOpForRedeem({
  response,
  operationId,
}: ClaimArgs): Promise<Signatures[]> {
  let signatures: Signatures[] = [];
  try {
    if (!response || response.length <= 0)
      throw new Error('No response from lambda');

    const operationToRedeem = filterResponse(response, operationId);

    if (operationToRedeem) {
      signatures = sortSignatures(operationToRedeem.signatures);
    }
  } catch (error) {
    console.error('Error fetching resource:', error);
    return [];
  }
  return signatures;
}

// sort signatures by relayerId
function sortSignatures(signatures: Signatures[]): Signatures[] {
  const sortedSignatures = signatures.sort((a, b) => a.relayerId - b.relayerId);
  const newSortedArray = [...sortedSignatures];

  return newSortedArray;
}

function filterResponse(
  response: Burned[],
  operationId: string | undefined,
): Burned | undefined {
  const filteredResults = response.filter(
    (item: Burned) =>
      item.outputTxId === null &&
      item.state === 'processing' &&
      item.inputOpId === operationId,
  );

  const operationToRedeem = filteredResults.find(
    (item: Burned) => item.inputOpId === operationId,
  );
  return operationToRedeem;
}
