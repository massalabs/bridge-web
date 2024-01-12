import { Tooltip } from '@massalabs/react-ui-kit';

import { SuccessCheck } from '@/components';
import { getSupportedTokenName } from '@/const';
import { formatAmount } from '@/utils/parseAmount';

export function ClaimSuccess({ ...args }) {
  const { operation: op } = args;
  const token = getSupportedTokenName(op.evmToken);
  let { full, in2decimals } = formatAmount(op.amount);

  return (
    <div
      key={op.inputOpId}
      className="flex justify-between items-center
          bg-secondary/50 backdrop-blur-lg text-f-primary 
          w-1/3 h-fit border border-tertiary rounded-2xl p-10"
    >
      <div className="flex">
        <p className="flex items-center gap-1 text-menu-active">
          You have successfully redeemed:{' '}
          <p className="mas-menu-active">{` ${in2decimals}  ${token}`}</p>
        </p>

        <Tooltip
          customClass="mas-caption w-fit whitespace-nowrap"
          content={full + ' ' + token}
        />
      </div>
      <SuccessCheck size="md" />
    </div>
  );
}
