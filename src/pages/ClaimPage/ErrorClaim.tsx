import { Button } from '@massalabs/react-ui-kit';
import { FiAlertCircle, FiRefreshCcw } from 'react-icons/fi';
import Intl from '@/i18n/i18n';
import { ClaimState } from '@/utils/const';
import { RedeemOperationToClaim } from '@/utils/lambdaApi';
import { formatAmount } from '@/utils/parseAmount';

interface ErrorClaimProps {
  operation: RedeemOperationToClaim;
  setClaimState: (state: ClaimState) => void; // TODO: rename to onClick
  symbol: string | undefined;
  claimState: ClaimState;
}

export function ErrorClaim(props: ErrorClaimProps) {
  const { operation: op, symbol, setClaimState, claimState } = props;
  let { amountFormattedPreview } = formatAmount(op.amount);

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
            onClick={() => {
              setClaimState(ClaimState.INIT);
            }}
          >
            <FiRefreshCcw />
          </Button>
        </div>
      )}
    </div>
  );
}
