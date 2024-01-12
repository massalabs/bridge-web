import { Tooltip, Button } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';

import { ClaimState } from './Claim';
import { getSupportedTokenName } from '@/const';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
import { RedeemOperationToClaim } from '@/utils/lambdaApi';
import { formatAmount } from '@/utils/parseAmount';

interface ClaimButton {
  operation: RedeemOperationToClaim;
  setClaimState: (state: ClaimState) => void;
}

export function ClaimButton({ ...args }: ClaimButton) {
  const { setClaimState, operation: op } = args;
  const { handleRedeem } = useEvmBridge();
  let { full, in2decimals } = formatAmount(op.amount);

  const token = getSupportedTokenName(op.evmToken);

  async function _handleRedeem(
    amount: string,
    recipient: `0x${string}`,
    inputOpId: string,
    signatures: string[],
  ) {
    setClaimState(ClaimState.PENDING);
    // decimals is set to zero because api reponses with correct amount already
    const redeem = await handleRedeem(
      parseUnits(amount, 0),
      recipient,
      inputOpId,
      signatures,
    );
    if (redeem) {
      // TODO: stuff maybe
    } else {
      // TODO: handle rejection error
      setClaimState(ClaimState.NONE);
    }
  }

  return (
    <div
      key={op.inputOpId}
      className="flex justify-between items-center
          bg-secondary/50 backdrop-blur-lg text-f-primary 
          w-1/4 h-fit border border-tertiary rounded-2xl p-10"
    >
      <div className="flex items-center">
        <p className="flex mas-menu-active">
          {in2decimals} {token}{' '}
        </p>
        <Tooltip
          customClass="mas-caption w-fit whitespace-nowrap"
          content={full + ' ' + token}
        />
      </div>
      <div>
        <Button
          onClick={() =>
            _handleRedeem(op.amount, op.recipient, op.inputOpId, op.signatures)
          }
        >
          Claim {token}
        </Button>
      </div>
    </div>
  );
}
