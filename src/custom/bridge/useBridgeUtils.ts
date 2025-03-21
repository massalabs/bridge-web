import { useCallback } from 'react';
import { useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useOperationStore } from '@/store/operationStore';
import { BurnState } from '@/utils/const';

export function useBridgeUtils() {
  const { reset } = useGlobalStatusesStore();
  const { resetOperationStore, setBurnState } = useOperationStore();

  const closeLoadingBox = useCallback(() => {
    reset();
    resetOperationStore();
    setBurnState(BurnState.INIT);
  }, [reset, resetOperationStore, setBurnState]);

  return { closeLoadingBox };
}
