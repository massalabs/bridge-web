import { Button, formatAmount } from '@massalabs/react-ui-kit';
import { FiAlertCircle, FiRefreshCcw } from 'react-icons/fi';
import Intl from '@/i18n/i18n';
import { BurnRedeemOperation } from '@/store/operationStore';
import { ClaimState } from '@/utils/const';

interface ErrorClaimProps {
  operation: BurnRedeemOperation;
  onReset: () => void;
  symbol?: string;
  decimals?: number;
}

export function ErrorClaim(props: ErrorClaimProps) {
  const { operation, symbol, decimals, onReset } = props;

  const isAlreadyExecuted =
    operation.claimState === ClaimState.ALREADY_EXECUTED;

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
              {formatAmount(operation.amount, decimals).preview} {symbol}{' '}
            </strong>
          </div>
          <Button variant="icon" customClass="text-s-warning" onClick={onReset}>
            <FiRefreshCcw />
          </Button>
        </div>
      )}
    </div>
  );
}
