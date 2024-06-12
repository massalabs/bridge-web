import { Tooltip, formatAmount } from '@massalabs/react-ui-kit';
import { SuccessCheck } from '@/components';
import { LinkExplorer } from '@/components/LinkExplorer';
import { CHAIN_ID_TO_SERVICE_FEE } from '@/const';
import Intl from '@/i18n/i18n';
import { BurnRedeemOperation } from '@/store/operationStore';
import { getAmountToReceive } from '@/utils/utils';

interface SuccessClaimProps {
  operation: BurnRedeemOperation;
  symbol: string;
  decimals: number;
}

export function SuccessClaim(props: SuccessClaimProps) {
  const { operation, symbol, decimals } = props;

  const serviceFee = CHAIN_ID_TO_SERVICE_FEE[operation.evmChainId];

  // calculates amount received
  const receivedAmount = getAmountToReceive(
    BigInt(operation.amount),
    serviceFee,
  );

  // format amount received
  const { preview, full } = formatAmount(receivedAmount, decimals);

  return (
    <div
      className="flex justify-between items-center
          bg-secondary/50 backdrop-blur-lg text-f-primary 
          w-[620px] h-12 border border-tertiary rounded-2xl 
          px-10 py-14"
    >
      <div className="flex gap-2 items-center">
        <div>
          {Intl.t('claim.success')}
          <strong>
            {' '}
            {preview} {symbol}{' '}
          </strong>
        </div>
        <Tooltip body={full + ' ' + symbol} />
      </div>
      <div className="flex gap-4 items-center">
        <LinkExplorer
          currentTxId={operation.outputId}
          chainId={operation.evmChainId}
          size="sm"
        />
        <SuccessCheck size="md" />
      </div>
    </div>
  );
}
