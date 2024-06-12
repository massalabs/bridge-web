import { useCallback } from 'react';
import { useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useOperationStore } from '@/store/operationStore';
import { BurnState } from '@/utils/const';

export function useBridgeUtils() {
  const { reset } = useGlobalStatusesStore();
  const { setInputAmount, setOutputAmount, resetTxIDs, setBurnState } =
    useOperationStore();

  const closeLoadingBox = useCallback(() => {
    reset();
    setInputAmount(undefined);
    setOutputAmount(undefined);
    resetTxIDs();
    setBurnState(BurnState.INIT);
  }, [reset, setInputAmount, setOutputAmount, resetTxIDs, setBurnState]);

  return { closeLoadingBox };
}
