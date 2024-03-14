import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { config } from '@/const';
import { useResource } from '@/custom/api/useResource';
import { useBridgeModeStore } from '@/store/store';
import {
  Entities,
  OperationHistoryItem,
  lambdaEndpoint,
} from '@/utils/lambdaApi';

interface FetchBurnedWmasTxProps {
  burnTxHash: `0x${string}` | undefined;
}

export function useFetchBurnedWmasTx(props: FetchBurnedWmasTxProps) {
  const { burnTxHash } = props;

  const [enableRefetch, setEnableRefetch] = useState<boolean>(true);

  const { currentMode } = useBridgeModeStore();
  const { address } = useAccount();
  /* eslint-disable max-len */
  const queryParams = `?evmAddress=${address}&inputTxId=${burnTxHash}&entities=${Entities.ReleaseMAS}`;
  const lambdaUrl = `${config[currentMode].lambdaUrl}${lambdaEndpoint}${queryParams}`;

  // enableRefetch can be refactored direclty into a function that returns bool
  const { data } = useResource<OperationHistoryItem[]>(
    lambdaUrl,
    enableRefetch,
  );

  useEffect(() => {
    if (data === undefined || data.length === 0) return;

    if (data.length >= 2) {
      console.warn('Unexpected: multiple burned operations', data.length);
    }

    data[0].isConfirmed === false
      ? setEnableRefetch(true)
      : setEnableRefetch(false);
  }, [data]);

  return {
    lambdaResponse: data,
  };
}
