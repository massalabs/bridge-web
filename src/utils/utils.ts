import { formatFTAmount, removeTrailingZeros } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';
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
 * @returns string
 */
export function getAmountToReceive(
  amount: string | undefined,
  serviceFee: bigint,
  decimals: number | undefined,
  inFull = true,
): string {
  if (!amount || !decimals) {
    return '';
  }
  if (!serviceFee) {
    return amount;
  }
  const _amount = parseUnits(amount, decimals);
  const redeemFee = (_amount * serviceFee) / 10000n;
  const receivedAmount = _amount - redeemFee;

  const { amountFormattedFull } = formatFTAmount(receivedAmount, decimals);
  return inFull
    ? amountFormattedFull
    : removeTrailingZeros(amountFormattedFull);
}

/**
 * Converts a service fee in bigint to a percentage string meant to be displayed
 *
 * @param serviceFee - bigint service fee received from the read sc
 * @returns string representing the service fee in percentage
 */
export function serviceFeeToPercent(serviceFee: bigint): string {
  const convertedServiceFee = Number(serviceFee) / 1000;
  return `${convertedServiceFee}%`;
}
