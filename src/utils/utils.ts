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
 *
 * @param amount - string amount input
 * @param serviceFee - bigint service fee received from the read sc
 * @param decimals - IToken selectedToken.decimals
 * @returns string
 */

export function calculateAmountReceived(
  amount: string,
  serviceFee: bigint,
  decimals: number,
): string {
  if (!serviceFee) {
    return amount;
  }

  const _amount = Number(amount);

  const feesToPercent = Number(serviceFee) / 100;

  const receivedAmount = _amount - (_amount * feesToPercent) / 100;

  // what is rounding strategy ?
  return receivedAmount.toFixed(decimals);
}

// TBD is we need it
// function calculateAmountReceivedHistory() {}
