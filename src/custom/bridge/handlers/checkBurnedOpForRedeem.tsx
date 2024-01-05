import {
  Burned,
  Signatures,
} from '@/pages/Index/Layouts/LoadingLayout/RedeemLayout/lambdaApi';

interface ClaimArgs {
  burnedOpList: Burned[] | undefined;
  operationId: string | undefined;
}

// This function checks if there is an operation that has not been redeemed yet
// Conditions for return: state = processing, outputTxId = null, burnId = txHash
export function checkBurnedOpForRedeem({
  burnedOpList,
  operationId,
}: ClaimArgs): Signatures[] | [] {
  let signatures: Signatures[] = [];
  try {
    if (!burnedOpList || burnedOpList.length <= 0)
      throw new Error('No response from lambda');

    const operationToRedeem = filterResponse(burnedOpList, operationId);

    if (operationToRedeem) {
      signatures = sortSignatures(operationToRedeem.signatures);
      return signatures;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching resource:', error);
    return [];
  }
}

// sort signatures by relayerId
function sortSignatures(signatures: Signatures[]): Signatures[] {
  return signatures.sort((a, b) => a.relayerId - b.relayerId);
}

function filterResponse(
  BurnedOpList: Burned[],
  operationId: string | undefined,
): Burned | undefined {
  return BurnedOpList.filter(
    (item) =>
      item.outputTxId === null &&
      item.state === 'processing' &&
      item.inputOpId === operationId,
  ).find((item) => item.inputOpId === operationId);
}
