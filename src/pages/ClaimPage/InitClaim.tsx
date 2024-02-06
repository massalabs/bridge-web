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
  claimState: ClaimState;
}

export function InitClaim(args: ClaimButton) {
  const { operation: op, symbol, onStateChange, claimState } = args;
  const { handleRedeem } = useEvmBridge();

  const isClaimRejected = claimState === ClaimState.REJECTED;

  const claimTokenArgs = {
    amount: op.amount,
    recipient: op.recipient,
    token: op.evmToken,
    inputOpId: op.inputOpId,
    signatures: op.signatures,
    changeClaimState: onStateChange,
    redeemFunction: handleRedeem,
  };

  const displayContentArgs = {
    claimState,
    amount: op.amount,
    symbol,
  };

  const boxSize = isClaimRejected ? 'w-[720px]' : 'w-[520px]';

  return (
    <div
      className={`flex justify-between items-center
          bg-secondary/50 backdrop-blur-lg text-f-primary 
          ${boxSize} h-12 border border-tertiary rounded-2xl px-10 py-14`}
    >
      <DisplayContent {...displayContentArgs} />
      <div>
        <Button onClick={() => claimTokens(claimTokenArgs)}>
          {Intl.t('claim.claim')} {symbol}
        </Button>
      </div>
    </div>
  );
}

function DisplayContent({ ...args }) {
  const { claimState, amount, symbol } = args;
  let { full, in2decimals } = formatAmount(amount);

  const isClaimRejected = claimState === ClaimState.REJECTED;

  if (isClaimRejected) {
    return (
      <div>
        {Intl.t('claim.rejected-1')}
        <strong>
          {' '}
          {in2decimals} {symbol}{' '}
        </strong>
        {Intl.t('claim.rejected-2')}
      </div>
    );
  } else if (!isClaimRejected) {
    return (
      <div className="flex items-center">
        <strong>
          {in2decimals} {symbol}{' '}
        </strong>
        <Tooltip
          customClass="mas-caption w-fit whitespace-nowrap"
          body={full + ' ' + symbol}
        />
      </div>
    );
  }
}
