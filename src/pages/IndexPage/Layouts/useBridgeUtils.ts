import { useCallback } from 'react';
import { useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useOperationStore } from '@/store/operationStore';

export function useBridgeUtils() {
  const { reset } = useGlobalStatusesStore();
  const { setAmount, resetTxIDs } = useOperationStore();

  const closeLoadingBox = useCallback(() => {
    reset();
    setAmount('');
    resetTxIDs();
  }, [reset, setAmount, resetTxIDs]);

  return { closeLoadingBox };
}
