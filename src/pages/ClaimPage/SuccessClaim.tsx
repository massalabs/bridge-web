import { Tooltip, formatAmount } from '@massalabs/react-ui-kit';
import { SuccessCheck } from '@/components';
import { LinkExplorer } from '@/components/LinkExplorer';
import { useFetchBurnEvent } from '@/custom/bridge/useFetchBurnEvent';
import Intl from '@/i18n/i18n';
import { BurnRedeemOperation } from '@/store/operationStore';

interface SuccessClaimProps {
  operation: BurnRedeemOperation;
  symbol: string;
  decimals: number;
}

export function SuccessClaim(props: SuccessClaimProps) {
  const { operation, symbol, decimals } = props;

  const lambdaResponse = useFetchBurnEvent(operation.inputId);

  let outputPreview = '-';
  let outputFull = '-';

  if (
    lambdaResponse &&
    lambdaResponse[0].outputAmount !== undefined &&
    lambdaResponse[0].outputAmount !== null
  ) {
    const formattedResult = formatAmount(
      lambdaResponse[0].outputAmount,
      decimals,
    );
    outputPreview = formattedResult.preview;
    outputFull = formattedResult.full;
  }

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
            {outputPreview} {symbol}{' '}
          </strong>
        </div>
        <Tooltip body={outputFull + ' ' + symbol} />
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
