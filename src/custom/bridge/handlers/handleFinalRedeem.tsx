import { Log as IEventLog } from 'viem';

import { ICustomError } from './handleErrorMessage';
import { waitForRedeemedEvent } from '../massa-utils';
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

    const found = await waitForRedeemedEvent(events, EVMOperationID.current);

    if (found) {
      setLoading({
        box: 'success',
        redeem: 'success',
      });
      EVMOperationID.current = undefined;
      getTokens();
    }
  } catch (error) {
    console.error(error);
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
