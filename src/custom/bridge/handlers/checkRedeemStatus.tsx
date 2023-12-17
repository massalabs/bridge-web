import { Log as IEventLog } from 'viem';

import { ILoadingState } from '@/const/types/types';

interface CheckRedeemStatus {
  events: IEventLog[];
  EVMOperationID: React.MutableRefObject<string | undefined>;
  setLoading: (state: ILoadingState) => void;
  getTokens: () => void;
  clearRedeem: () => void;
}

export function checkRedeemStatus({ ...args }: CheckRedeemStatus): boolean {
  const { events, EVMOperationID, setLoading, getTokens, clearRedeem } = args;

  if (!EVMOperationID.current) {
    return false;
  }

  const found = events.some(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ev) => (ev as any).args?.burnOpId === EVMOperationID.current,
  );

  if (found) {
    setLoading({
      box: 'success',
      redeem: 'success',
    });
    EVMOperationID.current = undefined;
    getTokens();
    clearRedeem();
    return true;
  } else {
    return false;
  }
}
