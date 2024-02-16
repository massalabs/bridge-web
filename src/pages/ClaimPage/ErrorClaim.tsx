import { SyntheticEvent } from 'react';
import { Button } from '@massalabs/react-ui-kit';
import { FiAlertCircle, FiRefreshCcw } from 'react-icons/fi';
import Intl from '@/i18n/i18n';
import { RedeemOperation } from '@/store/operationStore';
import { ClaimState } from '@/utils/const';
import { formatAmount } from '@/utils/parseAmount';

interface ErrorClaimProps {
  operation: RedeemOperation;
  onReset: () => void;
  symbol: string | undefined;
  claimState: ClaimState; // TODO: check if the claim state is not already in the operation
}

export function ErrorClaim(props: ErrorClaimProps) {
  const { operation, symbol, onReset, claimState } = props;
  let { amountFormattedPreview } = formatAmount(operation.amount);

  const isAlreadyExecuted = claimState === ClaimState.ALREADY_EXECUTED;

  return (
    <div
      className="flex justify-between items-center
          bg-secondary/50 backdrop-blur-lg text-f-primary 
          w-[520px] h-12 border border-tertiary rounded-2xl px-10 py-14"
    >
      {isAlreadyExecuted ? (
        <div className="flex items-center justify-between w-full">
          {Intl.t('claim.already-executed-message')}
          <FiAlertCircle size="34px" className="text-s-warning" />
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <div>
            {Intl.t('claim.error')}
            <strong>
              {' '}
              {amountFormattedPreview} {symbol}{' '}
            </strong>
          </div>
          <Button
            variant="icon"
            customClass="text-s-warning"
            onClick={(_: SyntheticEvent) => onReset()}
          >
            <FiRefreshCcw />
          </Button>
        </div>
      )}
    </div>
  );
}
