import { useCallback, useEffect } from 'react';
import { MassaLogo, Tooltip, formatAmount } from '@massalabs/react-ui-kit';
import { FiInfo } from 'react-icons/fi';

import { useAccount, useBalance } from 'wagmi';
import { EstimatedAmount } from '@/components/EstimatedAmount';
import { MASSA_TOKEN } from '@/const';
import { useEvmFeeEstimation } from '@/custom/api/useEvmFeeEstimation';
import {
  addFeesAndStorageCost,
  useMassaFeeEstimation,
} from '@/custom/api/useMassaFeeEstimation';
import useEvmToken from '@/custom/bridge/useEvmToken';
import {
  useEvmChainValidation,
  useGetChainValidationContext,
} from '@/custom/bridge/useNetworkValidation';
import { getEvmNetworkIcon } from '@/custom/useGetEvmIconsAndName';
import Intl from '@/i18n/i18n';

import {
  useAccountStore,
  useBridgeModeStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';

export function FeesEstimation() {
  const {
    isMassaToEvm,
    inputAmount,
    setFeesMAS,
    setStorageMAS,
    feesMAS,
    storageMAS,
    feesETH,
    setFeesETH,
  } = useOperationStore();
  const massaToEvm = isMassaToEvm();
  const { selectedToken } = useTokenStore();
  const { context } = useGetChainValidationContext();

  const isEvmNetworkValid = useEvmChainValidation(context);
  const { isConnected: isEvmWalletConnected, chain, address } = useAccount();
  const { connectedAccount } = useAccountStore();

  const { massaNetwork: getMassaNetwork } = useBridgeModeStore();

  const massaNetwork = getMassaNetwork();

  const { allowance } = useEvmToken();

  const { estimateClaimFees, estimateLockFees, estimateApproveFees } =
    useEvmFeeEstimation();

  const { data: balanceData } = useBalance({
    address,
  });

  const { estimateFeesMassa } = useMassaFeeEstimation();

  const getEthBridgeFees = useCallback((): bigint | undefined => {
    const lockFees = estimateLockFees();
    if (!inputAmount) return undefined;
    if (allowance < inputAmount) {
      const approveFees = estimateApproveFees();
      return approveFees + lockFees;
    } else {
      return lockFees;
    }
  }, [estimateLockFees, inputAmount, allowance, estimateApproveFees]);

  useEffect(() => {
    if (massaToEvm) {
      const { feesMAS, storageMAS } = estimateFeesMassa();
      setFeesMAS(feesMAS);
      setStorageMAS(storageMAS);
      const claimFees = estimateClaimFees();
      setFeesETH(claimFees);
    } else {
      setFeesMAS(0n);
      setStorageMAS(0n);
      const ethBridgeFees = getEthBridgeFees();
      setFeesETH(ethBridgeFees);
    }
  }, [
    setFeesMAS,
    setFeesETH,
    setStorageMAS,
    getEthBridgeFees,
    massaToEvm,
    estimateClaimFees,
    estimateFeesMassa,
  ]);

  if (
    !selectedToken ||
    !isEvmWalletConnected ||
    !connectedAccount ||
    !isEvmNetworkValid ||
    !inputAmount
  )
    return null;

  const symbolEVM = selectedToken.symbolEVM;
  const symbolMASSA = selectedToken.symbol;

  const chainName = chain ? chain.name : Intl.t('general.Unknown');

  const chainId = chain ? chain.id : 0;

  return (
    <div className="mas-body2">
      <div className="flex items-center justify-between">
        <p>{Intl.t('index.fee-estimate.bridge-rate')}</p>
        <div className="flex items-center">
          1 {symbolEVM} {Intl.t('index.fee-estimate.on')}{' '}
          <span className="mx-1">{getEvmNetworkIcon(chainId, 24)}</span> = 1{' '}
          {symbolMASSA} {Intl.t('index.fee-estimate.on')}{' '}
          <span className="ml-1">
            <MassaLogo size={24} />
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p>
            {Intl.t('index.fee-estimate.network-fees', {
              name: Intl.t('general.Massa'),
              network: Intl.t(`general.${massaNetwork}`),
            })}
          </p>
          {storageMAS !== 0n && (
            <Tooltip
              body={Intl.t('index.fee-estimate.tooltip-massa', {
                fees: formatAmount(storageMAS || 0n).full,
              })}
            >
              <FiInfo size={18} />
            </Tooltip>
          )}
        </div>
        <EstimatedAmount
          amount={formatAmount(addFeesAndStorageCost(feesMAS, storageMAS)).full}
          symbol={MASSA_TOKEN}
        />
      </div>
      <div className="flex items-center justify-between mb-2">
        <p>
          {Intl.t('index.fee-estimate.network-fees', {
            name: chainName,
          })}
        </p>
        <EstimatedAmount
          amount={formatAmount(feesETH || '', 18).full}
          symbol={balanceData?.symbol}
        />
      </div>
    </div>
  );
}
