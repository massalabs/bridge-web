import { Tooltip, Button } from '@massalabs/react-ui-kit';
import { ClaimState } from './ClaimButton';
import { claimTokens } from '../../utils/claimTokens';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
import Intl from '@/i18n/i18n';
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
        <Button onClick={() => claimTokens(claimTokenArgs)}>
          {Intl.t('claim.claim')} {symbol}
        </Button>
      </div>
    </div>
  );
}
