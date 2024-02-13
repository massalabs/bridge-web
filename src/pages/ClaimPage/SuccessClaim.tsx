import { Button, Tooltip } from '@massalabs/react-ui-kit';
import { FiExternalLink } from 'react-icons/fi';

import { useBridgeModeStore } from '../../store/store';
import { EVM_EXPLORER } from '../../utils/const';
import { SuccessCheck } from '@/components';
import Intl from '@/i18n/i18n';
import { RedeemOperation } from '@/store/operationStore';
import { formatAmount } from '@/utils/parseAmount';

interface SuccessClaimProps {
  operation: RedeemOperation;
  symbol?: string;
}

export function SuccessClaim(props: SuccessClaimProps) {
  const { operation: op, symbol } = props;
  let { amountFormattedFull, amountFormattedPreview } = formatAmount(op.amount);

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noreferrer');
  };

  const { currentMode } = useBridgeModeStore();

  const explorerUrl = EVM_EXPLORER[currentMode] + 'tx/' + op.outputTxId;

  return (
    <div
      className="flex justify-between items-center
          bg-secondary/50 backdrop-blur-lg text-f-primary 
          w-[620px] h-12 border border-tertiary rounded-2xl 
          px-10 py-14"
    >
      <div className="flex items-center">
        <div>
          {Intl.t('claim.success')}
          <strong>
            {' '}
            {amountFormattedPreview} {symbol}{' '}
          </strong>
        </div>
        <Tooltip
          customClass="mas-caption w-fit whitespace-nowrap"
          body={amountFormattedFull + ' ' + symbol}
        />
      </div>
      <div className="flex gap-4 items-center">
        {op.outputTxId && (
          <Button variant="icon" onClick={() => openInNewTab(explorerUrl)}>
            <FiExternalLink size={18} />
          </Button>
        )}
        <SuccessCheck size="md" />
      </div>
    </div>
  );
}
