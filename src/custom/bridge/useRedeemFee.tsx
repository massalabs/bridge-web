import { useEffect, useState } from 'react';
import { formatFTAmount } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';
import { useReadContracts } from 'wagmi';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { config } from '@/const';
import { useBridgeModeStore } from '@/store/modeStore';
import { useOperationStore } from '@/store/operationStore';
import { useTokenStore } from '@/store/tokenStore';

export function useRedeemFee() {
  const { currentMode } = useBridgeModeStore();
  const { selectedEvm } = useOperationStore();
  const { selectedToken } = useTokenStore();
  const redeemFeeContract = {
    address: config[currentMode][selectedEvm] as `0x${string}`,
    abi: bridgeVaultAbi,
  };

  const [redeemFee, setRedeemFee] = useState<bigint>();
  const [isServiceFeeActivated, setIsServiceFeeActivated] =
    useState<boolean>(false);

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
      setRedeemFee(data[0].result as bigint);
      if (data[0].result !== BigInt(0)) {
        setIsServiceFeeActivated(true);
      }
    }
  }, [data]);

  // what type is data

  // amount entered is a string
  function calculateAmountReceived(amount: string) {
    if (!selectedToken) return;
    const _amount = parseUnits(amount, selectedToken.decimals);
    if (!redeemFee) {
      return amount;
    }

    const receivedAmount = (_amount * redeemFee) / BigInt(10 ** 18);

    return formatFTAmount(receivedAmount, selectedToken.decimals);
  }
  return { redeemFee, calculateAmountReceived, isServiceFeeActivated };
}
