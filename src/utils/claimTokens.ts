import { toast } from '@massalabs/react-ui-kit';
import { ClaimState } from './const';
import Intl from '@/i18n/i18n';
import {
  CustomError,
  isOperationAlreadyExecutedError,
  isRejectedByUser,
} from '@/utils/error';

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
  changeClaimState,
  redeemFunction,
}: ClaimTokensProps) {
  try {
    changeClaimState(ClaimState.PENDING);
    await redeemFunction(amount, recipient, token, inputOpId, signatures);
  } catch (error) {
    const typedError = error as CustomError;
    if (isRejectedByUser(typedError)) {
      toast.error(Intl.t('claim.rejected'));
      changeClaimState(ClaimState.REJECTED);
    } else if (isOperationAlreadyExecutedError(typedError)) {
      toast.error(Intl.t('claim.already-executed'));
      changeClaimState(ClaimState.ALREADY_EXECUTED);
    } else {
      toast.error(Intl.t('claim.error-toast'));
      changeClaimState(ClaimState.ERROR);
    }
  }
}
