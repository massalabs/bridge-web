import { ClaimState } from './ClaimButton';
import { ErrorCheck } from '@/components';
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

  setTimeout(() => {
    onStateChange(ClaimState.INIT);
  }, 3000);

  return (
    <div
      className="flex justify-between items-center
          bg-secondary/50 backdrop-blur-lg text-f-primary 
          w-[520px] h-12 border border-tertiary rounded-2xl px-10 py-14"
    >
      <div className="flex items-center bg-blue-500">
        {Intl.t('claim.error')}
        <strong>
          {' '}
          {in2decimals} {symbol}{' '}
        </strong>
      </div>
      <ErrorCheck size="md" />
    </div>
  );
}
