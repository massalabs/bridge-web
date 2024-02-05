import { Burned, filterByOpId, sortSignatures } from '@/utils/lambdaApi';

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
  const operationToRedeem = filterByOpId(burnedOpList, operationId);

  if (operationToRedeem) {
    const signatures = operationToRedeem.signatures;

    return sortSignatures(signatures);
  } else {
    return [];
  }
}
