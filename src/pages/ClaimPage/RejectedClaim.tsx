import { RedeemOperationToClaim } from '@/utils/lambdaApi';
import { formatAmount } from '@/utils/parseAmount';
import { ClaimState } from './ClaimButton';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
import { CustomError, isRejectedByUser } from '@/utils/error';
import { toast, Button } from '@massalabs/react-ui-kit';
import Intl from '@/i18n/i18n';

interface FailedClaimProps {
  operation: RedeemOperationToClaim;
  symbol: string | undefined;
  onStateChange: (state: ClaimState) => void;
}

export function RejectedClaim(args: FailedClaimProps) {
  const { symbol, operation: op, onStateChange } = args;

  let { in2decimals } = formatAmount(op.amount);

  const { handleRedeem } = useEvmBridge();

  async function _handleRedeem(
    amount: string,
    recipient: `0x${string}`,
    token: `0x${string}`,
    inputOpId: string,
    signatures: string[],
  ) {
    try {
      onStateChange(ClaimState.PENDING);
      await handleRedeem(amount, recipient, token, inputOpId, signatures);
    } catch (error) {
      const typedError = error as CustomError;
      if (isRejectedByUser(typedError)) {
        toast.error(Intl.t('claim.rejected'));
        onStateChange(ClaimState.REJECTED);
      } else {
        onStateChange(ClaimState.ERROR);
      }
    }
  }
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
            _handleRedeem(
              op.amount,
              op.recipient,
              op.evmToken,
              op.inputOpId,
              op.signatures,
            );
          }}
        >
          {Intl.t('claim.claim')} {symbol}
        </Button>
      </div>
    </div>
  );
}
