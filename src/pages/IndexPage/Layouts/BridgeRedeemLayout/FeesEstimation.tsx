import { useCallback, useEffect, useState } from 'react';
import { toMAS } from '@massalabs/massa-web3';
import {
  FetchingLine,
  MassaLogo,
  Tooltip,
  formatAmount,
} from '@massalabs/react-ui-kit';
import { FiInfo } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { parseUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { EthSvg } from '@/assets/EthSvg';
import { SepoliaSvg } from '@/assets/SepoliaSVG';
import { increaseAllowanceStorageCost } from '@/bridge/storage-cost';
import {
  Blockchain,
  forwardBurnFees,
  increaseAllowanceFee,
  MASSA_TOKEN,
  PAGES,
} from '@/const';
import { useFeeEstimation } from '@/custom/api/useFeeEstimation';
import { useConnectedEvmChain } from '@/custom/bridge/useConnectedEvmChain';
import useEvmToken from '@/custom/bridge/useEvmToken';
import Intl from '@/i18n/i18n';
import {
  useAccountStore,
  useBridgeModeStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';

import { IToken } from '@/store/tokenStore';

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
  const { isMassaToEvm, amount } = useOperationStore();
  const massaToEvm = isMassaToEvm();
  const { selectedToken } = useTokenStore();
  const {
    evmNetwork: getEvmNetwork,
    massaNetwork: getMassaNetwork,
    isMainnet,
  } = useBridgeModeStore();
  const { isConnected: isEvmWalletConnected, chain } = useAccount();

  const evmNetwork = getEvmNetwork();
  const massaNetwork = getMassaNetwork();

  const { allowance } = useEvmToken();

  const [feesETH, setFeesETH] = useState<string>();
  const [storageMAS, setStorageMAS] = useState<bigint>();
  const [feesMAS, setFeesMAS] = useState<bigint>();

  const { estimateClaimFees, estimateLockFees, estimateApproveFees } =
    useFeeEstimation();

  const { address } = useAccount();

  const { data: balanceData } = useBalance({
    address,
  });

  const { connectedAccount } = useAccountStore();

  const currentEvmChain = useConnectedEvmChain();

  const estimateFeesMassa = useCallback(
    async (selectedToken: IToken, amount?: string) => {
      const amountInBigInt = parseUnits(amount || '0', selectedToken.decimals);
      let storageCostMAS = forwardBurnFees.coins;
      let feesCostMAS = forwardBurnFees.fee;
      if (
        selectedToken.allowance === 0n ||
        selectedToken.allowance < amountInBigInt
      ) {
        storageCostMAS += await increaseAllowanceStorageCost();
        feesCostMAS += increaseAllowanceFee.fee;
      }
      setStorageMAS(storageCostMAS);
      setFeesMAS(feesCostMAS);
    },
    [],
  );

  useEffect(() => {
    const setFeesETHWithCheck = (fees: bigint) => {
      if (fees === 0n) {
        setFeesETH(undefined);
      } else {
        setFeesETH(formatAmount(fees.toString(), 18).amountFormattedFull);
      }
    };

    if (massaToEvm) {
      if (!selectedToken) {
        setFeesMAS(undefined);
        setStorageMAS(undefined);
        return;
      }
      estimateFeesMassa(selectedToken, amount);
      setFeesETHWithCheck(estimateClaimFees());
    } else {
      setFeesMAS(0n);
      setStorageMAS(0n);
      if (!selectedToken) {
        setFeesETH(undefined);
        return;
      }
      const amountInBigInt = parseUnits(amount || '0', selectedToken.decimals);
      const lockFees = estimateLockFees();
      if (allowance < amountInBigInt) {
        const approveFees = estimateApproveFees();
        setFeesETHWithCheck(approveFees + lockFees);
      } else {
        setFeesETHWithCheck(lockFees);
      }
    }
  }, [
    massaToEvm,
    amount,
    allowance,
    estimateApproveFees,
    estimateLockFees,
    estimateClaimFees,
    estimateFeesMassa,
    selectedToken,
    connectedAccount, // update the estimation when account change to take into account the new allowance
  ]);

  if (!selectedToken || !isEvmWalletConnected || !connectedAccount) return null;

  const symbolEVM = selectedToken.symbolEVM;
  const symbolMASSA = selectedToken.symbol;

  const chainName = chain
    ? chain.name
    : Intl.t(`general.${Blockchain.UNKNOWN}`);

  if (currentEvmChain === Blockchain.BSC) {
    return (
      <div className="text-s-warning">
        {Intl.t('dao-maker.dao-bridge-redeem-warning')}{' '}
        <Link to={`/${PAGES.DAO}`}>
          <u>{Intl.t('dao-maker.page-name')} </u>
        </Link>
      </div>
    );
  }

  const storageMASString = storageMAS ? toMAS(storageMAS).toString() : '';
  const totalCostMASString = toMAS(
    (storageMAS ?? 0n) + (feesMAS ?? 0n),
  ).toString();

  return (
    <div className="mas-body2">
      <div className="flex items-center justify-between">
        <p>{Intl.t('index.fee-estimate.bridge-rate')}</p>
        <div className="flex items-center">
          1 {symbolEVM} {Intl.t('index.fee-estimate.on')}{' '}
          <span className="mx-1">
            {isMainnet() ? <EthSvg size={20} /> : <SepoliaSvg size={20} />}
          </span>{' '}
          = 1 {symbolMASSA} {Intl.t('index.fee-estimate.on')}{' '}
          <span className="ml-1">
            <MassaLogo size={20} />
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <p>
            {Intl.t('index.fee-estimate.network-fees', {
              name: Intl.t(`general.${Blockchain.MASSA}`),
              network: Intl.t(`general.${massaNetwork}`),
            })}
          </p>
          {storageMAS !== 0n && (
            <Tooltip
              body={Intl.t('index.fee-estimate.tooltip-massa', {
                fees: storageMASString,
              })}
            >
              <FiInfo size={18} />
            </Tooltip>
          )}
        </div>
        <EstimatedAmount amount={totalCostMASString} symbol={MASSA_TOKEN} />
      </div>
      <div className="flex items-center justify-between">
        <p>
          {Intl.t('index.fee-estimate.network-fees', {
            name: chainName,
            network: Intl.t(`general.${evmNetwork}`),
          })}
        </p>
        <EstimatedAmount amount={feesETH} symbol={balanceData?.symbol} />
      </div>
    </div>
  );
}
