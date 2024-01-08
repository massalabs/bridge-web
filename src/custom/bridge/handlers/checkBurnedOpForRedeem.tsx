import {
  Burned,
  Signatures,
} from '@/pages/Index/Layouts/LoadingLayout/RedeemLayout/lambdaApi';

export interface ClaimArgs {
  burnedOpList: Burned[];
  operationId: string;
}

// This function checks if there is an operation that has not been redeemed yet
// Conditions for return: state = processing, outputTxId = null, burnId = txHash
export function checkBurnedOpForRedeem({
  burnedOpList,
  operationId,
}: ClaimArgs): Signatures[] | [] {
  let signatures: Signatures[] = [];

  // if (!burnedOpList?.length) throw new Error('No burned operations found');

  const operationToRedeem = filterResponse(burnedOpList, operationId);

  if (operationToRedeem) {
    signatures = sortSignatures(operationToRedeem.signatures);
    return signatures;
  } else {
    return [];
  }
}

// sort signatures by relayerId
function sortSignatures(signatures: Signatures[]): Signatures[] {
  return signatures.sort((a, b) => a.relayerId - b.relayerId);
}

function filterResponse(
  BurnedOpList: Burned[],
  operationId: string,
): Burned | undefined {
  return BurnedOpList.find(
    (item) =>
      item.outputTxId === null &&
      item.state === 'processing' &&
      item.inputOpId === operationId,
  );
}
