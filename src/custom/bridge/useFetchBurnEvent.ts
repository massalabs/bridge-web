import { useState, useEffect } from 'react';
import { useResource } from '../api/useResource';
import { config } from '@/const';
import { useOperationStore } from '@/store/operationStore';
import { useBridgeModeStore } from '@/store/store';
import { lambdaEndpoint, OperationHistoryItem } from '@/utils/lambdaApi';

export function useFetchBurnEvent(inputOpId?: string) {
  const { burnTxId } = useOperationStore();
  const { currentMode } = useBridgeModeStore();
  const [enableRefetch, setEnableRefetch] = useState<boolean>(true);

  const queryParams = `?inputOpId=${inputOpId ?? burnTxId}`;
  const lambdaUrl = `${config[currentMode].lambdaUrl}${lambdaEndpoint}${queryParams}`;

  const { data } = useResource<OperationHistoryItem[]>(
    lambdaUrl,
    enableRefetch,
  );

  useEffect(() => {
    if (!data) return;
    if (
      (data[0]?.serverState === 'processing' &&
        data[0]?.inputId === burnTxId) || // disable refetch on burn redeem
      (data[0]?.outputAmount !== null && data[0]?.outputAmount !== undefined) // disable refetch success claim
    ) {
      setEnableRefetch(false);
    }
  }, [data, burnTxId]);
  return data;
}
