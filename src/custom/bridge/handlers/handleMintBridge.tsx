import { useTokenStore } from '../../../store/store';
import { waitForMintEvent } from '../massa-utils';
import { GlobalStatusesStoreState, Status } from '@/store/globalStatusesStore';

interface ICustomError extends Error {
  cause?: {
    error: string;
    details: string;
  };
}

export interface MintArgs {
  massaOperationID: string;
  globalStatusesStore: GlobalStatusesStoreState;
}

export async function handleMintBridge(args: MintArgs): Promise<boolean> {
  const { massaOperationID, globalStatusesStore } = args;

  try {
    globalStatusesStore.setMint(Status.Loading);
    const success = await waitForMintEvent(massaOperationID);
    if (success) {
      globalStatusesStore.setBox(Status.Success);
      globalStatusesStore.setMint(Status.Success);
      const { refreshBalances } = useTokenStore.getState();
      refreshBalances();
    }
  } catch (error) {
    handleMintError(globalStatusesStore, error);
    return false;
  }
  return true;
}

function handleMintError(
  globalStatusesStore: GlobalStatusesStoreState,
  error: undefined | unknown,
) {
  const typedError = error as ICustomError;

  const cause = typedError?.cause;
  const isTimeout = cause?.error === 'timeout';

  if (isTimeout) {
    globalStatusesStore.setBox(Status.Warning);
    globalStatusesStore.setMint(Status.Warning);
  } else {
    console.error(error);
    globalStatusesStore.setMint(Status.Error);
    globalStatusesStore.setError(Status.Error);
  }
}
