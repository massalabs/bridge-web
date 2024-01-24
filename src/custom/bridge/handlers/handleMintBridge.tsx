import { IAccount } from '@massalabs/wallet-provider';
import { ICustomError } from './handleErrorMessage';
import { useAccountStore } from '../../../store/store';
import { waitForMintEvent } from '../massa-utils';
import { LoadingState } from '@/const';

export interface MintArgs {
  massaOperationID: string;
  setLoading: (state: LoadingState) => void;
  refreshBalances: (connectedAccount?: IAccount) => void;
}

export async function handleMintBridge(args: MintArgs): Promise<boolean> {
  const { massaOperationID, setLoading, refreshBalances } = args;
  try {
    setLoading({
      mint: 'loading',
    });
    const success = await waitForMintEvent(massaOperationID);
    if (success) {
      setLoading({
        box: 'success',
        mint: 'success',
      });
      const { connectedAccount } = useAccountStore.getState();
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
