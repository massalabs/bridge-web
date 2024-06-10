import { formatAmount, getAssetIcons, Tooltip } from '@massalabs/react-ui-kit';
import { useGetEvmIconsAndName } from '@/custom/useGetEvmIconsAndName';
import Intl from '@/i18n/i18n';
import { BurnRedeemOperation } from '@/store/operationStore';
import { ClaimState } from '@/utils/const';
import { maskAddress } from '@/utils/massaFormat';

interface DisplayContentProps {
  claimState: ClaimState;
  operation: BurnRedeemOperation;
  symbol: string;
  decimals?: number;
}

export function OperationInfo(props: DisplayContentProps) {
  const { claimState, operation, symbol, decimals } = props;
  let { amountFormattedFull, amountFormattedPreview } = formatAmount(
    operation.amount,
    decimals,
  );

  const { getEvmChainName, getEvmNetworkIcon } = useGetEvmIconsAndName();

  const isClaimRejected = claimState === ClaimState.REJECTED;

  if (isClaimRejected) {
    return (
      <div>
        {Intl.t('claim.rejected-1')}
        <strong>
          {amountFormattedPreview} {symbol}
        </strong>
        {Intl.t('claim.rejected-2')}
      </div>
    );
  } else if (!isClaimRejected) {
    return (
      <div className="flex flex-col gap-4">
        <strong className="flex items-center gap-2">
          {getAssetIcons(symbol, operation.evmChainId, true, 26)}
          {amountFormattedPreview} {symbol}
          <Tooltip body={amountFormattedFull + ' ' + symbol} />
        </strong>

        <div className="flex items-center gap-2">
          {getEvmNetworkIcon(operation.evmChainId, 24)}
          {getEvmChainName(operation.evmChainId)}
        </div>
        <div>{maskAddress(operation.recipient, 4)}</div>
      </div>
    );
  }
}
