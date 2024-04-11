import { useCallback } from 'react';
import { useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useOperationStore } from '@/store/operationStore';
import { BurnState } from '@/utils/const';

export function useBridgeUtils() {
  const { reset } = useGlobalStatusesStore();
  const { setAmount, resetTxIDs, setBurnState } = useOperationStore();

  const closeLoadingBox = useCallback(() => {
    reset();
    setAmount('');
    resetTxIDs();
    setBurnState(BurnState.INIT);
  }, [reset, setAmount, resetTxIDs, setBurnState]);

  return { closeLoadingBox, setBurnState };
}
