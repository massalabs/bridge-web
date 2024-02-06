import { Burned, filterByOpId, sortSignatures } from '@/utils/lambdaApi';

export interface ClaimArgs {
  burnedOpList: Burned[];
  currentTxID: string;
}

// This function checks if there is an operation that has not been redeemed yet
// Conditions for return: state = processing, outputTxId = null, burnId = txHash
export function checkBurnedOpForRedeem({
  burnedOpList,
  currentTxID,
}: ClaimArgs): string[] | [] {
  const operationToRedeem = filterByOpId(burnedOpList, currentTxID);

  if (operationToRedeem) {
    const signatures = operationToRedeem.signatures;

    return sortSignatures(signatures);
  } else {
    return [];
  }
}
