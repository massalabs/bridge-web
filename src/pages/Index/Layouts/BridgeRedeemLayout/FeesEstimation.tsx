import { useEffect, useState } from 'react';
import { toMAS } from '@massalabs/massa-web3';
import { MassaLogo, Tooltip } from '@massalabs/react-ui-kit';
import { FiInfo } from 'react-icons/fi';
import { parseUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { EthSvg } from '../../../../assets/EthSvg';
import { FetchingLine } from '../LoadingLayout/FetchingComponent';
import { forwardBurnFees, increaseAllowanceFee, massaToken } from '@/const';
import { useFeeEstimation } from '@/custom/api/useFeeEstimation';
import useEvmToken from '@/custom/bridge/useEvmToken';
import Intl from '@/i18n/i18n';
import { useOperationStore, useTokenStore } from '@/store/store';
import { SIDE } from '@/utils/const';
import { formatAmount } from '@/utils/parseAmount';

interface FeesEstimationProps {
  amount?: string;
  symbol?: string;
}

function EstimatedAmount(props: FeesEstimationProps) {
  const { amount, symbol } = props;

  const [fade, setFade] = useState(false);
  const [amountCopy, setAmountCopy] = useState(amount);

  useEffect(() => {
    setFade(true);
    const timeout = setTimeout(() => {
      setFade(false);
      setAmountCopy(amount);
    }, 500);
    return () => clearTimeout(timeout);
  }, [amount]);

  return (
    <div className="flex items-center">
      {amount && symbol ? (
        <span
          className={`transition-opacity duration-500 ease-in-out ${
            fade ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {amountCopy} {symbol}
        </span>
      ) : (
        <FetchingLine width={52} height={2} />
      )}
    </div>
  );
}

export function FeesEstimation() {
  const { side, amount } = useOperationStore();
  const massaToEvm = side === SIDE.MASSA_TO_EVM;
  const { selectedToken } = useTokenStore();

  const { allowance } = useEvmToken();

  const [feesETH, setFeesETH] = useState<string>();
  const [feesMAS, setFeesMAS] = useState<string>();

  const { estimateClaimFees, estimateLockFees, estimateApproveFees } =
    useFeeEstimation();

  const { address } = useAccount();

  const { data: balanceData } = useBalance({
    address,
  });

  useEffect(() => {
    const setFeesETHWithCheck = (fees: bigint) => {
      if (fees === 0n) {
        setFeesETH(undefined);
      } else {
        setFeesETH(formatAmount(fees.toString()).amountFormattedFull);
      }
    };

    if (massaToEvm) {
      if (!selectedToken) {
        setFeesMAS(undefined);
        return;
      }
      const amountInBigInt = parseUnits(amount || '0', selectedToken.decimals);
      let storageFeesMAS = forwardBurnFees.coins;
      if (selectedToken.allowance < amountInBigInt) {
        storageFeesMAS += increaseAllowanceFee.coins;
      }
      setFeesMAS(toMAS(storageFeesMAS).toString());
      setFeesETHWithCheck(estimateClaimFees());
    } else {
      setFeesMAS('0');
      if (!selectedToken) {
        setFeesETH(undefined);
        return;
      }
      const amountInBigInt = parseUnits(amount || '0', selectedToken.decimals);
      Promise.all([
        allowance < amountInBigInt
          ? estimateApproveFees()
          : Promise.resolve(0n),
        estimateLockFees(),
      ]).then(([approveFees, lockFees]) => {
        setFeesETHWithCheck(approveFees + lockFees);
      });
    }
  }, [
    massaToEvm,
    amount,
    allowance,
    estimateApproveFees,
    estimateLockFees,
    estimateClaimFees,
    selectedToken,
  ]);

  if (!selectedToken) return null;

  const symbolEVM = selectedToken.symbolEVM;
  const symbolMASSA = selectedToken.symbol;

  return (
    <div className="mas-body2">
      <div className="flex items-center justify-between">
        <p>{Intl.t('index.fee-estimate.bridge-rate')}</p>
        <div className="flex items-center">
          1 {symbolEVM} {Intl.t('index.fee-estimate.on')}{' '}
          <span className="mx-1">
            <EthSvg />
          </span>{' '}
          = 1 {symbolMASSA} {Intl.t('index.fee-estimate.on')}{' '}
          <span className="ml-1">
            <MassaLogo size={20} />
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <p>{Intl.t('index.fee-estimate.massa')}</p>
          {feesMAS && feesMAS !== '0' && (
            <Tooltip
              body={Intl.t('index.fee-estimate.tooltip-massa', {
                fees: feesMAS,
              })}
            >
              <FiInfo size={18} />
            </Tooltip>
          )}
        </div>
        <EstimatedAmount amount={feesMAS} symbol={massaToken} />
      </div>
      <div className="flex items-center justify-between">
        <p>{Intl.t('index.fee-estimate.ethereum')}</p>
        <EstimatedAmount amount={feesETH} symbol={balanceData?.symbol} />
      </div>
    </div>
  );
}
