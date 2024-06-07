import { useEffect, useState } from 'react';
import { useReadContracts } from 'wagmi';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { config } from '@/const';
import { useBridgeModeStore } from '@/store/modeStore';
import { useOperationStore } from '@/store/operationStore';

export function useServiceFee() {
  const { currentMode } = useBridgeModeStore();
  const { selectedEvm } = useOperationStore();

  const redeemFeeContract = {
    address: config[currentMode][selectedEvm] as `0x${string}`,
    abi: bridgeVaultAbi,
  };

  const [serviceFee, setServiceFee] = useState<bigint>(0n);

  // the read will fail is user is not connected to correct network
  const { data } = useReadContracts({
    contracts: [
      {
        ...redeemFeeContract,
        functionName: 'redeemFee',
        args: [],
      },
    ],
  });

  useEffect(() => {
    if (data && data[0].status === 'success') {
      setServiceFee(data[0].result as bigint);
    }
  }, [data]);

  return { serviceFee };
}
