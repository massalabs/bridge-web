import { Client } from '@massalabs/massa-web3';

import { ICustomError } from './handleErrorMessage';
import { waitForMintEvent } from '../massa-utils';
import { ILoadingState } from '@/const';

interface MintBridge {
  massaClient: Client;
  massaOperationID: string;
  setLoading: (state: ILoadingState) => void;
  getTokens: () => void;
}

export async function handleMintBridge({
  ...args
}: MintBridge): Promise<boolean> {
  const { setLoading, massaClient, massaOperationID, getTokens } = args;
  try {
    setLoading({
      mint: 'loading',
    });
    const success = await waitForMintEvent(massaClient, massaOperationID);
    if (success) {
      setLoading({
        box: 'success',
        mint: 'success',
      });
      getTokens();
    }
  } catch (error) {
    handleMintError({ ...args }, error);
    return false;
  }
  return true;
}

function handleMintError({ ...args }, error: any) {
  const { setLoading } = args;
  const typedError = error as ICustomError;

  const cause = typedError?.cause;
  const isTimeout = cause?.error === 'timeout';

  if (isTimeout) {
    setLoading({
      box: 'warning',
      mint: 'warning',
    });
  } else {
    console.error(error);
    setLoading({
      mint: 'error',
      error: 'error',
    });
  }
}
