import { useEffect } from 'react';
import { Tooltip, Button, formatAmount } from '@massalabs/react-ui-kit';
import { handleEvmClaimError } from '../../custom/bridge/handlers/handleTransactionErrors';
import { useClaim } from '../../custom/bridge/useClaim';
import { Spinner } from '@/components';
import Intl from '@/i18n/i18n';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { BurnRedeemOperation } from '@/store/operationStore';
import { ClaimState } from '@/utils/const';

interface InitClaimProps {
  operation: BurnRedeemOperation;
  symbol?: string;
  decimals?: number;
  onUpdate: (op: Partial<BurnRedeemOperation>) => void;
}

export function InitClaim(props: InitClaimProps) {
  const { operation, symbol, decimals, onUpdate } = props;
  const { write, error, isSuccess, hash, isPending } = useClaim();
  const { setClaim } = useGlobalStatusesStore();

  const claimState = operation.claimState;
  const isClaimRejected = claimState === ClaimState.REJECTED;
  const boxSize = isClaimRejected ? 'w-[720px]' : 'w-[520px]';

  useEffect(() => {
    if (isPending && claimState !== ClaimState.PENDING) {
      onUpdate({ claimState: ClaimState.PENDING });
    }
    if (
      isSuccess &&
      hash &&
      claimState !== ClaimState.SUCCESS &&
      !operation.outputId
    ) {
      onUpdate({ outputId: hash, claimState: ClaimState.SUCCESS });
    }
    if (error) {
      const errorClaimState = handleEvmClaimError(error);
      if (claimState !== errorClaimState) {
        onUpdate({ claimState: errorClaimState });
      }
    }
  }, [isPending, error, isSuccess, hash, claimState, operation, onUpdate]);

  function handleClaim() {
    onUpdate({ claimState: ClaimState.AWAITING_SIGNATURE });
    setClaim(Status.Loading);
    write({
      amount: operation.amount,
      recipient: operation.recipient,
      inputOpId: operation.inputId,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      evmToken: operation.evmToken!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      signatures: operation.signatures!,
    });
  }

  if (
    claimState === ClaimState.PENDING ||
    claimState === ClaimState.AWAITING_SIGNATURE
  ) {
    return <PendingClaim />;
  }

  return (
    <div
      className={`flex justify-between items-center
          bg-secondary/50 backdrop-blur-lg text-f-primary 
          ${boxSize} h-12 border border-tertiary rounded-2xl px-10 py-14`}
    >
      <DisplayContent
        claimState={claimState}
        amount={operation.amount}
        symbol={symbol}
        decimals={decimals}
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
  decimals?: number;
}

function DisplayContent(props: DisplayContentProps) {
  const { claimState, amount, symbol, decimals } = props;
  let { amountFormattedFull, amountFormattedPreview } = formatAmount(
    amount,
    decimals,
  );

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
