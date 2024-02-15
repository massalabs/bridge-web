import { useOperationStore, useTokenStore } from '../../../store/store';
import { waitForMintEvent } from '../massa-utils';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';

interface ICustomError extends Error {
  cause?: {
    error: string;
    details: string;
  };
}

export async function handleMintBridge(): Promise<boolean> {
  console.log('starting mint process');
  const { setBox, setMint } = useGlobalStatusesStore.getState();

  const { lockTxId } = useOperationStore.getState();

  if (!lockTxId) {
    return false;
  }

  try {
    setMint(Status.Loading);

    const success = await waitForMintEvent(lockTxId);
    if (success) {
      setBox(Status.Success);
      setMint(Status.Success);
      const { refreshBalances } = useTokenStore.getState();
      refreshBalances();
    }
  } catch (error) {
    handleMintError(error);
    return false;
  }
  return true;
}

function handleMintError(error: undefined | unknown) {
  const { setBox, setMint } = useGlobalStatusesStore.getState();
  const typedError = error as ICustomError;

  const cause = typedError?.cause;
  const isTimeout = cause?.error === 'timeout';

  if (isTimeout) {
    setBox(Status.Warning);
    setMint(Status.Warning);
  } else {
    console.error(error);
    setMint(Status.Error);
  }
}
