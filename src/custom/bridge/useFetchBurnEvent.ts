import { useState, useEffect } from 'react';
import { useResource } from '../api/useResource';
import { config } from '@/const';
import { useOperationStore } from '@/store/operationStore';
import { useBridgeModeStore } from '@/store/store';
import { lambdaEndpoint, OperationHistoryItem } from '@/utils/lambdaApi';

export function useFetchBurnEvent() {
  const { burnTxId } = useOperationStore();
  const { currentMode } = useBridgeModeStore();
  const [enableRefetch, setEnableRefetch] = useState<boolean>(true);

  const queryParams = `?&inputTxId=${burnTxId}`;
  const lambdaUrl = `${config[currentMode].lambdaUrl}${lambdaEndpoint}${queryParams}`;

  const { data } = useResource<OperationHistoryItem[]>(
    lambdaUrl,
    enableRefetch,
  );

  useEffect(() => {
    if (data?.length) {
      setEnableRefetch(false);
    }
  }, [data]);
  return data;
}
