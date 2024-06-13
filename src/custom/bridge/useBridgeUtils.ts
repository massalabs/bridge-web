import { useCallback } from 'react';
import { useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useOperationStore } from '@/store/operationStore';
import { BurnState } from '@/utils/const';

export function useBridgeUtils() {
  const { reset } = useGlobalStatusesStore();
  const { setAmounts, resetTxIDs, setBurnState } = useOperationStore();

  const closeLoadingBox = useCallback(() => {
    reset();
    setAmounts(undefined, undefined);
    resetTxIDs();
    setBurnState(BurnState.INIT);
  }, [reset, setAmounts, resetTxIDs, setBurnState]);

  return { closeLoadingBox };
}
