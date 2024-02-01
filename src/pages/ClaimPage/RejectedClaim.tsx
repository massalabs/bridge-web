import { Button } from '@massalabs/react-ui-kit';
import { ClaimState } from './ClaimButton';
import { claimTokens } from '../../utils/claimTokens';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
import Intl from '@/i18n/i18n';
import { RedeemOperationToClaim } from '@/utils/lambdaApi';
import { formatAmount } from '@/utils/parseAmount';

interface FailedClaimProps {
  operation: RedeemOperationToClaim;
  symbol: string | undefined;
  onStateChange: (state: ClaimState) => void;
}

export function RejectedClaim(args: FailedClaimProps) {
  const { symbol, operation: op, onStateChange } = args;

  let { in2decimals } = formatAmount(op.amount);

  const { handleRedeem } = useEvmBridge();

  const claimTokenArgs = {
    amount: op.amount,
    recipient: op.recipient,
    token: op.evmToken,
    inputOpId: op.inputOpId,
    signatures: op.signatures,
    changeClaimState: onStateChange,
    redeemFunction: handleRedeem,
  };

  return (
    <div
      className="flex justify-between items-center
          bg-secondary/50 backdrop-blur-lg text-f-primary 
          w-[620px] h-12 border border-tertiary rounded-2xl px-10 py-14"
    >
      <div>
        {Intl.t('claim.rejected-1')}
        <strong>
          {' '}
          {in2decimals} {symbol}{' '}
        </strong>
        {Intl.t('claim.rejected-2')}
      </div>
      <div className="w-fit">
        <Button
          onClick={() => {
            claimTokens(claimTokenArgs);
          }}
        >
          {Intl.t('claim.claim')} {symbol}
        </Button>
      </div>
    </div>
  );
}
