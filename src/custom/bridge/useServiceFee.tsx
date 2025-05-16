import { useEffect, useState } from 'react';
import { useReadContracts } from 'wagmi';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { config } from '@/const';
import { useBridgeModeStore } from '@/store/modeStore';
import { useOperationStore } from '@/store/operationStore';

/* Return the service fee ratio expressed as percentage on 10000
expl:
  If the service fee ratio is 0.05% the return value will be 5
  If the service fee ratio is 0.5% the return value will be 50
  If the service fee ratio is 5% the return value will be 500
  If the service fee ratio is 50% the return value will be 5000
  If the service fee ratio is 100% the return value will be 10000

  The service fee ratio value is retrieved from EVM bridge vault contract  
*/
export function useServiceFee() {
  const { currentMode } = useBridgeModeStore();
  const { selectedEvm } = useOperationStore();
  const { isMassaToEvm } = useOperationStore();

  const massaToEvm = isMassaToEvm();

  const redeemFeeContract = {
    address: config[currentMode][selectedEvm] as `0x${string}`,
    abi: bridgeVaultAbi,
  };

  const [serviceFee, setServiceFee] = useState<bigint>(0n);

  // the read will fail if user is not connected to correct network
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
      if (!massaToEvm) {
        setServiceFee(0n);
      } else {
        setServiceFee(data[0].result as bigint);
      }
    }
  }, [data, massaToEvm]);

  return { serviceFee };
}
