import { Log as IEventLog } from 'viem';

import { ILoadingState } from '@/const/types/types';

export async function handleFinalRedeem(
  events: IEventLog[],
  EVMOperationID: React.MutableRefObject<string | undefined>,
  setLoading: (state: ILoadingState) => void,
  getTokens: () => void,
): Promise<boolean> {
  try {
    if (!EVMOperationID.current) {
      return false;
    }

    const found = events.some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ev) => (ev as any).args.burnOpId === EVMOperationID.current,
    );

    if (found) {
      setLoading({
        box: 'success',
        redeem: 'success',
      });
      EVMOperationID.current = undefined;
      getTokens();
    }
  } catch {
    return false;
  }
  return true;
}
