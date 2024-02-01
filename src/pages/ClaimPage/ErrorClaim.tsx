import { Button } from '@massalabs/react-ui-kit';
import { FiRefreshCcw } from 'react-icons/fi';
import { ClaimState } from './ClaimButton';
import Intl from '@/i18n/i18n';
import { RedeemOperationToClaim } from '@/utils/lambdaApi';
import { formatAmount } from '@/utils/parseAmount';

interface ErrorClaimArgs {
  operation: RedeemOperationToClaim;
  onStateChange: (state: ClaimState, txHash?: `0x${string}` | null) => void;
  symbol: string | undefined;
}

export function ErrorClaim(args: ErrorClaimArgs) {
  const { operation: op, symbol, onStateChange } = args;
  let { in2decimals } = formatAmount(op.amount);

  return (
    <div
      className="flex justify-between items-center
          bg-secondary/50 backdrop-blur-lg text-f-primary 
          w-[520px] h-12 border border-tertiary rounded-2xl px-10 py-14"
    >
      <div>
        {Intl.t('claim.error')}
        <strong>
          {' '}
          {in2decimals} {symbol}{' '}
        </strong>
      </div>
      <Button
        variant="icon"
        customClass="text-s-warning"
        onClick={() => {
          onStateChange(ClaimState.INIT);
        }}
      >
        <FiRefreshCcw />
      </Button>
    </div>
  );
}
