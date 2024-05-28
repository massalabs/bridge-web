import { Button, Tooltip, formatAmount } from '@massalabs/react-ui-kit';
import { FiExternalLink } from 'react-icons/fi';

import { bsc, bscTestnet } from 'viem/chains';
import { useBridgeModeStore } from '../../store/store';
import { EVM_EXPLORER } from '../../utils/const';
import { SuccessCheck } from '@/components';
import { SupportedEvmBlockchain } from '@/const';
import Intl from '@/i18n/i18n';
import { BurnRedeemOperation } from '@/store/operationStore';

interface SuccessClaimProps {
  operation: BurnRedeemOperation;
  symbol?: string;
  decimals?: number;
}

export function SuccessClaim(args: SuccessClaimProps) {
  const { operation, symbol, decimals } = args;
  const { currentMode } = useBridgeModeStore();
  let { amountFormattedFull, amountFormattedPreview } = formatAmount(
    operation.amount,
    decimals,
  );

  const txHash = operation.outputId;
  const chainID = operation.evmChainId;

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noreferrer');
  };

  function getExplorerUrl(): string {
    if (!txHash || !chainID) return '';

    if (chainID === bsc.id || chainID === bscTestnet.id) {
      return `${
        EVM_EXPLORER[SupportedEvmBlockchain.BSC][currentMode]
      }${txHash}`;
    }

    return `${EVM_EXPLORER[SupportedEvmBlockchain.ETH][currentMode]}${txHash}`;
  }

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
        {txHash && (
          <Button variant="icon" onClick={() => openInNewTab(getExplorerUrl())}>
            <FiExternalLink size={18} />
          </Button>
        )}
        <SuccessCheck size="md" />
      </div>
    </div>
  );
}
