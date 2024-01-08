import {
  Burned,
  Signatures,
  opertationStates,
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
}: ClaimArgs): string[] | [] {
  let signatures: Signatures[] = [];

  const operationToRedeem = filterResponse(burnedOpList, operationId);

  if (operationToRedeem) {
    signatures = sortSignatures(operationToRedeem.signatures);

    // isolates signatures from relayer ID
    return signatures.map((signature: Signatures) => {
      return signature.signature;
    });
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
      item.state === opertationStates.processing &&
      item.inputOpId === operationId,
  );
}
