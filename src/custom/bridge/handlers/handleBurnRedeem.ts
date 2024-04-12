import { toast } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';
import Intl from '../../../i18n/i18n';
import { forwardBurn } from '../bridge';
import { waitIncludedOperation } from '../massa-utils';
import { TIMEOUT } from '@/const/const';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import {
  useAccountStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';
import { BurnState, ClaimState } from '@/utils/const';
import {
  CustomError,
  isRejectedByUser,
  isWalletTimeoutError,
} from '@/utils/error';
import {
  BridgingState,
  Entities,
  HistoryOperationStatus,
} from '@/utils/lambdaApi';

export interface BurnRedeemParams {
  recipient: `0x${string}`;
  amount: string;
  setBurnState: (state: BurnState) => void;
}

export async function handleBurnRedeem(
  args: BurnRedeemParams,
): Promise<boolean> {
  const { setBurn, setBox } = useGlobalStatusesStore.getState();

  try {
    await initiateBurn(args);
  } catch (error) {
    handleBurnError(args, error);
    setBox(Status.Error);
    setBurn(Status.Error);
    return false;
  }
  return true;
}

async function initiateBurn({
  recipient,
  amount,
  setBurnState,
}: BurnRedeemParams) {
  const { setBurn } = useGlobalStatusesStore.getState();
  const { setBurnTxId, appendBurnRedeemOperation } =
    useOperationStore.getState();
  const { selectedToken } = useTokenStore.getState();
  const { connectedAccount } = useAccountStore.getState();

  if (!selectedToken) {
    console.error('No token selected');
    return;
  }

  setBurn(Status.Loading);

  setBurnState(BurnState.AWAITING_INCLUSION);
  const burnOpId = await forwardBurn(recipient, amount);
  setBurnTxId(burnOpId);

  setBurnState(BurnState.PENDING);
  await waitIncludedOperation(burnOpId, true);

  setBurn(Status.Success);
  appendBurnRedeemOperation({
    inputId: burnOpId,
    signatures: [],
    claimState: ClaimState.RETRIEVING_INFO,
    amount: parseUnits(amount, selectedToken.decimals).toString(),
    recipient,
    evmToken: selectedToken.evmToken,
    massaToken: selectedToken.massaToken,
    emitter: connectedAccount?.address() || '',
    createdAt: new Date().toISOString(),
    serverState: BridgingState.new,
    historyStatus: HistoryOperationStatus.Unknown,
    entity: Entities.Burn,
    evmChainId: selectedToken.chainId,
    isConfirmed: false,
  });
  setBurnState(BurnState.SUCCESS);
}

function handleBurnError(args: BurnRedeemParams, error: undefined | unknown) {
  const { setBurnState } = args;

  const typedError = error as CustomError;
  const isErrorTimeout = typedError.cause?.error === TIMEOUT;
  if (isRejectedByUser(typedError)) {
    toast.error(Intl.t('index.burn.error.rejected'));
    setBurnState(BurnState.REJECTED);
  } else if (isWalletTimeoutError(typedError)) {
    toast.error(Intl.t('index.burn.error.timeout-signature'));
    setBurnState(BurnState.SIGNATURE_TIMEOUT);
  } else if (isErrorTimeout) {
    // when waitIncludedOperation fails to wait operation finality
    setBurnState(BurnState.OPERATION_FINALITY_TIMEOUT);
    toast.error(Intl.t('index.burn.error.timeout'));
  } else {
    setBurnState(BurnState.ERROR);
    toast.error(Intl.t('index.burn.error.unknown'));
    console.error(error);
  }
}
