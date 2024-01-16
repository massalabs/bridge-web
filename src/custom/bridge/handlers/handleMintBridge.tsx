import { Client } from '@massalabs/massa-web3';
import { IAccount } from '@massalabs/wallet-provider';

import { ICustomError } from './handleErrorMessage';
import { waitForMintEvent } from '../massa-utils';
import { LoadingState } from '@/const';

interface MintBridge {
  massaClient: Client;
  massaOperationID: string;
  connectedAccount?: IAccount;
  setLoading: (state: LoadingState) => void;
  refreshBalances: (connectedAccount?: IAccount) => void;
}

export async function handleMintBridge(args: MintBridge): Promise<boolean> {
  const {
    massaClient,
    massaOperationID,
    connectedAccount,
    setLoading,
    refreshBalances,
  } = args;
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
      refreshBalances(connectedAccount);
    }
  } catch (error) {
    handleMintError({ ...args }, error);
    return false;
  }
  return true;
}

function handleMintError({ ...args }, error: undefined | unknown) {
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
