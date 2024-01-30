import { Tooltip, Button, toast } from '@massalabs/react-ui-kit';
import { ClaimState } from './ClaimButton';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
import Intl from '@/i18n/i18n';
import { CustomError, isRejectedByUser } from '@/utils/error';
import { RedeemOperationToClaim } from '@/utils/lambdaApi';
import { formatAmount } from '@/utils/parseAmount';

interface ClaimButton {
  operation: RedeemOperationToClaim;
  onStateChange: (state: ClaimState, txHash?: `0x${string}` | null) => void;
  symbol: string | undefined;
}

export function InitClaim(args: ClaimButton) {
  const { operation: op, symbol, onStateChange } = args;
  const { handleRedeem } = useEvmBridge();
  let { full, in2decimals } = formatAmount(op.amount);

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
          w-[520px] h-12 border border-tertiary rounded-2xl px-10 py-14"
    >
      <div className="flex items-center">
        <strong>
          {in2decimals} {symbol}{' '}
        </strong>
        <Tooltip
          customClass="mas-caption w-fit whitespace-nowrap"
          content={full + ' ' + symbol}
        />
      </div>
      <div>
        <Button
          onClick={() =>
            _handleRedeem(
              op.amount,
              op.recipient,
              op.evmToken,
              op.inputOpId,
              op.signatures,
            )
          }
        >
          {Intl.t('claim.claim')} {symbol}
        </Button>
      </div>
    </div>
  );
}
