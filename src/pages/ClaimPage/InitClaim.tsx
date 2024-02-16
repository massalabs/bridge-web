import { useEffect } from 'react';
import { Tooltip, Button } from '@massalabs/react-ui-kit';
import { handleEvmClaimError } from '../../custom/bridge/handlers/handleTransactionErrors';
import { useClaim } from '../../custom/bridge/useClaim';
import { Spinner } from '@/components';
import Intl from '@/i18n/i18n';
import { RedeemOperation } from '@/store/operationStore';
import { ClaimState } from '@/utils/const';
import { formatAmount } from '@/utils/parseAmount';

interface InitClaimProps {
  operation: RedeemOperation;
  claimState: ClaimState; // TODO: check if the state is not already in the operation
  symbol?: string;
  onUpdate: (op: Partial<RedeemOperation>) => void;
}

export function InitClaim(props: InitClaimProps) {
  const { operation, symbol, claimState, onUpdate } = props;
  const { write, error, isSuccess, hash, isPending } = useClaim();

  const isClaimRejected = claimState === ClaimState.REJECTED;

  const boxSize = isClaimRejected ? 'w-[720px]' : 'w-[520px]';

  useEffect(() => {
    if (isPending) {
      onUpdate({ claimState: ClaimState.PENDING });
    }
    if (isSuccess && hash) {
      onUpdate({ outputTxId: hash, claimState: ClaimState.SUCCESS });
    }
    if (error) {
      onUpdate({ claimState: handleEvmClaimError(error) });
    }
  }, [isPending, error, isSuccess, hash, onUpdate]);

  function handleClaim() {
    onUpdate({ claimState: ClaimState.AWAITING_SIGNATURE });
    write(operation);
  }

  return claimState === ClaimState.PENDING ? (
    <PendingClaim />
  ) : (
    <div
      className={`flex justify-between items-center
          bg-secondary/50 backdrop-blur-lg text-f-primary 
          ${boxSize} h-12 border border-tertiary rounded-2xl px-10 py-14`}
    >
      <DisplayContent
        claimState={claimState}
        amount={operation.amount}
        symbol={symbol}
      />
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

interface DisplayContentProps {
  claimState: ClaimState;
  amount: string;
  symbol?: string;
}

function DisplayContent(props: DisplayContentProps) {
  const { claimState, amount, symbol } = props;
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
