import { toast } from '@massalabs/react-ui-kit';
import { ClaimState } from '../pages/ClaimPage/ClaimButton';
import Intl from '@/i18n/i18n';
import { CustomError, isRejectedByUser } from '@/utils/error';

interface ClaimTokensProps {
  amount: string;
  recipient: `0x${string}`;
  token: `0x${string}`;
  inputOpId: string;
  signatures: string[];
  changeClaimState: (state: ClaimState) => void;
  redeemFunction: (
    amount: string,
    recipient: `0x${string}`,
    token: `0x${string}`,
    burnOpId: string,
    signatures: string[],
  ) => Promise<boolean>;
}

export async function claimTokens({
  amount,
  recipient,
  token,
  inputOpId,
  signatures,
  changeClaimState: callback,
  redeemFunction,
}: ClaimTokensProps) {
  try {
    callback(ClaimState.PENDING);
    await redeemFunction(amount, recipient, token, inputOpId, signatures);
  } catch (error) {
    const typedError = error as CustomError;
    if (isRejectedByUser(typedError)) {
      toast.error(Intl.t('claim.rejected'));
      callback(ClaimState.REJECTED);
    } else {
      toast.error(Intl.t('claim.error-toast'));
      callback(ClaimState.ERROR);
    }
  }
}
