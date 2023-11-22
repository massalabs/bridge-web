import { Client } from '@massalabs/massa-web3';

import { ICustomError } from './handleErrorMessage';
import { waitForMintEvent } from '../massa-utils';
import { ILoadingState } from '@/const';

export async function handleMintBridge(
  massaClient: Client,
  MassaOperationID: string,
  setLoading: (state: ILoadingState) => void,
  getTokens: () => void,
) {
  setLoading({
    mint: 'loading',
  });

  try {
    const success = await waitForMintEvent(massaClient, MassaOperationID);
    if (success) {
      setLoading({
        box: 'success',
        mint: 'success',
      });
      getTokens();
    } else {
      setLoading({
        box: 'error',
        mint: 'error',
        error: 'error',
      });
    }
    return success;
  } catch (error) {
    // console.error(error);
    const cause = (error as ICustomError)?.cause;
    const isTimeout = cause?.error === 'timeout';

    if (isTimeout) {
      setLoading({
        box: 'warning',
        mint: 'warning',
      });
    } else {
      setLoading({
        box: 'error',
        mint: 'error',
        error: 'error',
      });
    }
    return false;
  }
}
