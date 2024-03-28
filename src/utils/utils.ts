import {
  MASSA_EXPLORER_URL,
  MASSA_EXPLO_URL,
  MASSA_EXPLO_EXTENSION,
} from './const';
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

export function linkifyBscTxIdToExplo(
  burnTxHash: `0x${string}` | undefined,
): string {
  const { isMainnet: getIsMainnet } = useBridgeModeStore.getState();
  const isMainnet = getIsMainnet();
  return `https://${isMainnet ? '' : 'testnet.'}bscscan.com/tx/${burnTxHash}`;
}
