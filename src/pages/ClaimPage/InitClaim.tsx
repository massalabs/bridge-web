import { useEffect } from 'react';
import { Tooltip, Button } from '@massalabs/react-ui-kit';
import { ClaimState } from './ClaimButton';
import { handleEvmClaimError } from '../../custom/bridge/handlers/handleTransactionErrors';
import { useClaim } from '../../custom/bridge/useClaim';
import { Spinner } from '@/components';
import Intl from '@/i18n/i18n';
import { RedeemOperationToClaim } from '@/utils/lambdaApi';
import { formatAmount } from '@/utils/parseAmount';

interface ClaimButton {
  operation: RedeemOperationToClaim;
  setClaimState: (state: ClaimState) => void;
  claimState: ClaimState;
  setHash: (hash: `0x${string}`) => void;
  symbol?: string;
}

export function InitClaim(args: ClaimButton) {
  const { operation: op, symbol, setClaimState, claimState, setHash } = args;
  const { write, error, isSuccess, hash } = useClaim();

  const isClaimRejected = claimState === ClaimState.REJECTED;
  const isPending = claimState === ClaimState.PENDING;

  const displayContentArgs = {
    claimState,
    amount: op.amount,
    symbol,
  };

  const boxSize = isClaimRejected ? 'w-[720px]' : 'w-[520px]';

  useEffect(() => {
    if (isSuccess && hash) {
      setClaimState(ClaimState.SUCCESS);
      setHash(hash);
    }
    if (error) {
      const state = handleEvmClaimError(error);
      setClaimState(state);
    }
  }, [error, isSuccess, hash, setHash, setClaimState]);

  function handleClaim() {
    setClaimState(ClaimState.PENDING);
    write(op);
  }

  return isPending ? (
    <PendingClaim />
  ) : (
    <div
      className={`flex justify-between items-center
          bg-secondary/50 backdrop-blur-lg text-f-primary 
          ${boxSize} h-12 border border-tertiary rounded-2xl px-10 py-14`}
    >
      <DisplayContent {...displayContentArgs} />
      <div>
        <Button onClick={() => handleClaim()}>
          {Intl.t('claim.claim')} {symbol}
        </Button>
      </div>
    </div>
  );
}

function PendingClaim() {
  return (
    <div
      className="flex justify-between items-center
          bg-secondary/50 backdrop-blur-lg text-f-primary 
          w-[520px] h-12 border border-tertiary 
          mas-menu-active rounded-2xl px-10 py-14 text-menu-active"
    >
      <p>{Intl.t('claim.pending')}</p>
      <Spinner size="md" />
    </div>
  );
}

function DisplayContent({ ...args }) {
  const { claimState, amount, symbol } = args;
  let { amountFormattedFull, amountFormattedPreview } = formatAmount(amount);

  const isClaimRejected = claimState === ClaimState.REJECTED;

  if (isClaimRejected) {
    return (
      <div>
        {Intl.t('claim.rejected-1')}
        <strong>
          {' '}
          {amountFormattedPreview} {symbol}{' '}
        </strong>
        {Intl.t('claim.rejected-2')}
      </div>
    );
  } else if (!isClaimRejected) {
    return (
      <div className="flex items-center">
        <strong>
          {amountFormattedPreview} {symbol}{' '}
        </strong>
        <Tooltip
          customClass="mas-caption w-fit whitespace-nowrap"
          body={amountFormattedFull + ' ' + symbol}
        />
      </div>
    );
  }
}
