import { useEffect, useState } from 'react';
import { toMAS } from '@massalabs/massa-web3';
import { MassaLogo } from '@massalabs/react-ui-kit';
import { formatEther, parseUnits } from 'viem';
import { useToken } from 'wagmi';
import { EthSvgRed } from '@/assets/EthSvgRed';
import { forwardBurnFees, increaseAllowanceFee } from '@/const';
import { useFeeEstimation } from '@/custom/api/useFeeEstimation';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
import Intl from '@/i18n/i18n';
import { useOperationStore, useTokenStore } from '@/store/store';
import { SIDE } from '@/utils/const';

interface FeesEstimationProps {
  amount: string | undefined;
}

export function FeesEstimation(props: FeesEstimationProps) {
  const { amount } = props;
  const { side } = useOperationStore();
  const massaToEvm = side === SIDE.MASSA_TO_EVM;
  const { selectedToken } = useTokenStore();
  const evmToken = selectedToken?.evmToken as `0x${string}`;
  const { data: tokenData } = useToken({ address: evmToken });
  const { allowance } = useEvmBridge();

  const [feesETH, setFeesETH] = useState('-');
  const [feesMAS, setFeesMAS] = useState('-');

  const { estimateClaimFees, estimateLockFees, estimateApproveFees } =
    useFeeEstimation();

  useEffect(() => {
    const setFeesETHWithCheck = (fees: bigint) => {
      if (fees === 0n) {
        setFeesETH('-');
      } else {
        setFeesETH(formatEther(fees));
      }
    };

    if (massaToEvm) {
      if (!selectedToken || !tokenData) {
        setFeesMAS('-');
        return;
      }
      const amountInBigInt = parseUnits(amount || '0', tokenData.decimals);
      let storageFeesMAS = forwardBurnFees.coins;
      if (selectedToken.allowance < amountInBigInt) {
        storageFeesMAS += increaseAllowanceFee.coins;
      }
      setFeesMAS(toMAS(storageFeesMAS).toString());
      setFeesETHWithCheck(estimateClaimFees());
    } else {
      setFeesMAS('0');
      if (!tokenData) {
        setFeesETH('-');
        return;
      }
      const amountInBigInt = parseUnits(amount || '0', tokenData.decimals);
      Promise.all([
        allowance < amountInBigInt
          ? estimateApproveFees()
          : Promise.resolve(0n),
        estimateLockFees(amount || '0'),
      ]).then(([approveFees, lockFees]) => {
        setFeesETHWithCheck(approveFees + lockFees);
      });
    }
  }, [
    massaToEvm,
    amount,
    tokenData,
    allowance,
    estimateApproveFees,
    estimateLockFees,
    estimateClaimFees,
    selectedToken,
  ]);

  if (!selectedToken) return null;

  const symbolEVM = selectedToken.symbol;
  const symbolMASSA = symbolEVM + '.e';

  return (
    <div>
      <div className="flex items-center justify-between">
        <p>{Intl.t('index.fee-estimate.bridge-rate')}</p>
        <div className="flex items-center">
          1 {symbolEVM} {Intl.t('index.fee-estimate.on')}{' '}
          <span className="mx-1">
            <EthSvgRed />
          </span>{' '}
          = 1 {symbolMASSA} {Intl.t('index.fee-estimate.on')}{' '}
          <span className="ml-1">
            <MassaLogo size={20} />
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p>{Intl.t('index.fee-estimate.massa')}</p>
        {/* potential tooltip here */}
        <div className="flex items-center">{feesMAS} MAS</div>
      </div>
      <div className="flex items-center justify-between">
        <p>{Intl.t('index.fee-estimate.ethereum')}</p>
        {/* potential tooltip here */}
        <div className="flex items-center">{feesETH} ETH</div>
      </div>
    </div>
  );
}
