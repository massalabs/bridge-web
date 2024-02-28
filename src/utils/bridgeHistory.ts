import { SIDE } from './const';
import { Burned, Locked } from './lambdaApi';

export function formatApiCreationTime(inputTimestamp: string) {
  const dateObject = new Date(inputTimestamp);
  return dateObject.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  });
}

export interface LambdaHookHistory {
  burned: Burned[];
  locked: Locked[];
}

export enum HistoryOperationStatus {
  Claimable = 'claimable',
  Pending = 'pending',
  Done = 'done',
  Error = 'error',
  Unknown = 'unknown',
}

// Shared information between Lock and burn
export interface OperationHistoryItem {
  side: SIDE;
  time: string;
  amount: string;
  status: HistoryOperationStatus;
  outputId?: string;
  inputId?: string | `0x${string}`;
  evmToken: `0x${string}`;
}

// converts
// Burned op to history item
export function burnToItem(object: Burned): OperationHistoryItem {
  return {
    side: SIDE.MASSA_TO_EVM,
    inputId: object.inputOpId,
    time: object.createdAt,
    amount: object.amount,
    status: getBurnedStatus(
      object.isConfirmed,
      object.outputTxId,
      object.error,
      object.state,
    ),
    outputId: object.outputTxId ?? undefined,
    evmToken: object.evmToken,
  };
}

// Locked op to history item
export function lockToItem(object: Locked): OperationHistoryItem {
  return {
    side: SIDE.EVM_TO_MASSA,
    time: object.createdAt,
    inputId: object.inputTxId,
    amount: object.amount,
    status: getLockedStatus(object.isConfirmed, object.error, object.state),
    outputId: object.outputOpId,
    evmToken: object.evmToken,
  };
}

// status correspondance fn's
export function getBurnedStatus(
  isConfirmed: boolean,
  outputTxId: string | null,
  error: null | {
    msg: string;
    code: number;
    title: string;
  },
  state: string,
): HistoryOperationStatus {
  if (error !== null) {
    return HistoryOperationStatus.Error;
  }
  if (isConfirmed) {
    return HistoryOperationStatus.Done;
  }
  if (state === 'processing') {
    if (outputTxId) {
      return HistoryOperationStatus.Pending;
    }
    return HistoryOperationStatus.Claimable;
  }
  return HistoryOperationStatus.Unknown;
}

export function getLockedStatus(
  isConfirmed: boolean,
  error: null | {
    msg: string;
    code: number;
    title: string;
  },
  state: string,
): HistoryOperationStatus {
  if (error !== null) {
    return HistoryOperationStatus.Error;
  }
  if (isConfirmed) {
    return HistoryOperationStatus.Done;
  }
  if (state === 'processing' || state === 'new') {
    return HistoryOperationStatus.Pending;
  }
  return HistoryOperationStatus.Unknown;
}

export function mergeBurnAndLock(
  burnedArray: Burned[],
  lockedArray: Locked[],
): OperationHistoryItem[] {
  return [
    ...burnedArray.map((item) => burnToItem(item)),
    ...lockedArray.map((item) => lockToItem(item)),
  ]
    .sort((a, b) => {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    })
    .sort((a, b) =>
      a.status === HistoryOperationStatus.Pending &&
      b.status !== HistoryOperationStatus.Pending
        ? -1
        : a.status !== HistoryOperationStatus.Pending &&
          b.status === HistoryOperationStatus.Pending
        ? 1
        : 0,
    );
}
