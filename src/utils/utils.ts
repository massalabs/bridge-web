import {
  MASSA_EXPLORER_URL,
  MASSA_EXPLO_URL,
  MASSA_EXPLO_EXTENSION,
  ethMinConfirmations,
  bscMinConfirmations,
} from './const';
import { SupportedEvmBlockchain } from '@/const';
import { useBridgeModeStore } from '@/store/store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeJsonParse(str: string): any {
  try {
    return JSON.parse(str);
  } catch (e) {
    return undefined;
  }
}

export function capitalize(str: string | null): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function stringToByteArray(input: string): Uint8Array {
  const utf8Encoder = new TextEncoder();
  return utf8Encoder.encode(input);
}

export function linkifyMassaOpIdToExplo(txId: string | `0x${string}`): string {
  const { isMainnet: getIsMainnet } = useBridgeModeStore.getState();

  const isMainnet = getIsMainnet();

  return isMainnet
    ? `${MASSA_EXPLORER_URL}${txId}`
    : `${MASSA_EXPLO_URL}${txId}${MASSA_EXPLO_EXTENSION}`;
}

export function getMinConfirmation(
  selectedEvm: SupportedEvmBlockchain,
): number {
  if (selectedEvm === SupportedEvmBlockchain.ETH) {
    return ethMinConfirmations;
  }
  return bscMinConfirmations;
}

/**
 * Calculates the amount to be received after the service fee is applied
 *
 * @param amount - string amount input
 * @param serviceFee - bigint service fee received from the read sc
 * @param decimals - IToken selectedToken.decimals
 * @param inFull - boolean to return the full amount or amount with no trailing zeros
 * @returns bigint of the amount to be received
 */
export function getAmountToReceive(amount: bigint, serviceFee: bigint): bigint {
  if (serviceFee === 0n) {
    return amount;
  }
  const redeemFee = (amount * serviceFee) / 10000n;
  return amount - redeemFee;
}

/**
 * Calculates the service fee amount to be deducted from the input amount
 *
 * @param amount - string amount input
 * @param serviceFee - bigint service fee received from the read sc
 * @returns bigint of the service fee amount
 */

export function getServiceFeeAmount(
  amount: bigint,
  serviceFee: bigint,
): bigint {
  return (amount * serviceFee) / 10000n;
}

/**
 * Converts a service fee in bigint to a percentage string meant to be displayed
 *
 * @param serviceFee - bigint service fee received from the read sc
 * @returns string representing the service fee in percentage
 */
export function serviceFeeToPercent(serviceFee: bigint): string {
  const convertedServiceFee = Number(serviceFee) / 100;
  return `${convertedServiceFee}%`;
}

export function retrievePercent(
  amountIn: string,
  amountOut?: string,
): { serviceFee: bigint; percent: string } {
  if (amountOut === undefined || amountOut === null) {
    return { serviceFee: 0n, percent: '-%' };
  }
  const amountInNum = BigInt(amountIn);
  const amountOutNum = BigInt(amountOut);
  if (amountInNum === 0n) {
    return { serviceFee: 0n, percent: '0%' };
  }
  const feeAmount = amountInNum - amountOutNum;
  if (feeAmount === 0n) {
    return { serviceFee: 0n, percent: '0%' };
  }
  const percent = (feeAmount * 10_000n) / amountInNum;
  return { serviceFee: percent, percent: serviceFeeToPercent(percent) };
}
