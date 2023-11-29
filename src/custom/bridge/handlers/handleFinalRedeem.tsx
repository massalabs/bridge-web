import { Log as IEventLog } from 'viem';

import { ICustomError } from './handleErrorMessage';
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
  } catch (error) {
    const cause = (error as ICustomError)?.cause;
    const isTimeout = cause?.error === 'timeout';
    if (isTimeout) {
      setLoading({
        box: 'warning',
        mint: 'warning',
      });
    }
    return false;
  }
  return true;
}
