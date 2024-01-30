import { Button, Tooltip } from '@massalabs/react-ui-kit';
import { FiExternalLink } from 'react-icons/fi';

import { useBridgeModeStore } from '../../store/store';
import { EVM_EXPLORER } from '../../utils/const';
import { SuccessCheck } from '@/components';
import Intl from '@/i18n/i18n';
import { RedeemOperationToClaim } from '@/utils/lambdaApi';
import { formatAmount } from '@/utils/parseAmount';

interface SuccessClaimProps {
  operation: RedeemOperationToClaim;
  txHash: `0x${string}` | null;
  symbol: string | undefined;
}

export function SuccessClaim(args: SuccessClaimProps) {
  const { operation: op, txHash, symbol } = args;
  let { full, in2decimals } = formatAmount(op.amount);

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noreferrer');
  };

  const [currentMode] = useBridgeModeStore((state) => [state.currentMode]);

  const explorerUrl = EVM_EXPLORER[currentMode] + 'tx/' + txHash;

  return (
    <div
      className="flex justify-between items-center
          bg-secondary/50 backdrop-blur-lg text-f-primary 
          w-[520px] h-12 border border-tertiary rounded-2xl 
          px-10 py-14"
    >
      <div className="flex items-center">
        <div className="flex items-center gap-1">
          <p>{Intl.t('claim.success')}</p>
          <p className="mas-menu-active">
            {in2decimals} {symbol}
          </p>
        </div>

        <Tooltip
          customClass="mas-caption w-fit whitespace-nowrap"
          content={full + ' ' + symbol}
        />
        {/* this may be temporary, I am waiting for designs */}
        {txHash && (
          <Button variant="icon" onClick={() => openInNewTab(explorerUrl)}>
            <FiExternalLink size={18} />
          </Button>
        )}
      </div>
      <SuccessCheck size="md" />
    </div>
  );
}
