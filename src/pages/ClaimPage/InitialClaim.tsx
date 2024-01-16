import { Tooltip, Button } from '@massalabs/react-ui-kit';

import { ClaimState } from './ClaimButton';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
import Intl from '@/i18n/i18n';
import { RedeemOperationToClaim } from '@/utils/lambdaApi';
import { formatAmount } from '@/utils/parseAmount';

interface ClaimButton {
  operation: RedeemOperationToClaim;
  setClaimState: (state: ClaimState) => void;
  symbol: string | undefined;
}

export function InitialClaim(args: ClaimButton) {
  const { setClaimState, operation: op, symbol } = args;
  const { handleRedeem } = useEvmBridge();
  let { full, in2decimals } = formatAmount(op.amount);

  async function _handleRedeem(
    amount: string,
    recipient: `0x${string}`,
    inputOpId: string,
    signatures: string[],
  ) {
    setClaimState(ClaimState.PENDING);
    await handleRedeem(BigInt(amount), recipient, inputOpId, signatures);
  }

  return (
    <div
      className="flex justify-between items-center
          bg-secondary/50 backdrop-blur-lg text-f-primary 
          w-[520px] h-12 border border-tertiary rounded-2xl px-10 py-14"
    >
      <div className="flex items-center">
        <p className="flex mas-menu-active">
          {in2decimals} {symbol}{' '}
        </p>

        <Tooltip
          customClass="mas-caption w-fit whitespace-nowrap"
          content={full + ' ' + symbol}
        />
      </div>
      <div>
        <Button
          onClick={() =>
            _handleRedeem(op.amount, op.recipient, op.inputOpId, op.signatures)
          }
        >
          {Intl.t('claim.claim')} {symbol}
        </Button>
      </div>
    </div>
  );
}