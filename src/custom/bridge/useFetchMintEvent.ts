import { useEffect, useState } from 'react';
import { useResource } from '../api/useResource';
import { config } from '@/const';
import { useOperationStore } from '@/store/operationStore';
import { useBridgeModeStore } from '@/store/store';
import { OperationHistoryItem, lambdaEndpoint } from '@/utils/lambdaApi';

export function useFetchMintEvent(): OperationHistoryItem[] | undefined {
  const { lockTxId } = useOperationStore();
  const { currentMode } = useBridgeModeStore();
  const [enableRefetch, setEnableRefetch] = useState<boolean>(true);

  const queryParams = `?&inputTxId=${lockTxId}`;
  const lambdaUrl = `${config[currentMode].lambdaUrl}${lambdaEndpoint}${queryParams}`;

  const { data } = useResource<OperationHistoryItem[]>(
    lambdaUrl,
    enableRefetch,
  );

  useEffect(() => {
    if (!data) return;
    if (data[0]?.isConfirmed) {
      setEnableRefetch(false);
    }
  }, [data]);

  return data;
}
