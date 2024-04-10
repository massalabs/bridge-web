import { useEffect } from 'react';
import { Tooltip } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { ClaimRedeem } from './ClaimRedeem';
import { LoadingState } from '../LoadingState';
import { ShowLinkToExplorers } from '../ShowLinkToExplorers';
import { useConnectorName } from '@/custom/bridge/useConnectorName';
import { useFetchBurnEvent } from '@/custom/bridge/useFetchBurnEvent';
import Intl from '@/i18n/i18n';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import {
  useAccountStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';
import { ClaimState } from '@/utils/const';
import {
  BridgingState,
  Entities,
  HistoryOperationStatus,
} from '@/utils/lambdaApi';
import { linkifyMassaOpIdToExplo } from '@/utils/utils';

export function RedeemLayout() {
  const { burn, approve, claim, setBurn } = useGlobalStatusesStore();
  const {
    burnTxId,
    getCurrentRedeemOperation,
    appendBurnRedeemOperation,
    amount,
  } = useOperationStore();
  const { connectedAccount } = useAccountStore();
  const { selectedToken } = useTokenStore();
  const { address: evmAddress } = useAccount();
  const evmWalletName = useConnectorName();

  // wait for burn success --> then check additional conditions
  // once burn is a success show claim button + change title & block redeem flow
  const isBurnSuccessful = burn === Status.Success;

  const explorerUrl = linkifyMassaOpIdToExplo(burnTxId as string);

  const claimState = getCurrentRedeemOperation()?.claimState;

  const lambdaResponse = useFetchBurnEvent();

  const lambdaResponseIsEmpty =
    lambdaResponse === undefined || lambdaResponse.length === 0;

  useEffect(() => {
    console.log();
    if (burn === Status.Success) return;
    console.log('lambdaResponse', lambdaResponse);
    if (lambdaResponseIsEmpty || !amount || !evmAddress || !selectedToken)
      return;
    console.log('burn is successful');
    setBurn(Status.Success);
    appendBurnRedeemOperation({
      inputId: burnTxId as string,
      signatures: [],
      claimState: ClaimState.RETRIEVING_INFO,
      amount: parseUnits(amount, selectedToken.decimals).toString(),
      recipient: evmAddress as string,
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
  }, [lambdaResponse, lambdaResponseIsEmpty, setBurn]);

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between">
          <p className="mas-body-2">{Intl.t('index.loading-box.approve')}</p>
          <LoadingState state={approve} />
        </div>
        <div className="flex justify-between">
          <p className="mas-body-2">
            {Intl.t('index.loading-box.burn-label', {
              // state: getBurnStateTranslation(burnState),
              state: 'bob & alice',
            })}
          </p>
          <LoadingState state={burn} />
        </div>
        <div className="flex justify-between">
          <div className="mas-body-2 flex items-center">
            {Intl.t('index.loading-box.claim-label', {
              state: getClaimStateTranslation(claimState),
            })}
            {claimState === ClaimState.PENDING && (
              <Tooltip
                body={Intl.t('index.loading-box.claim-pending-tooltip', {
                  wallet: evmWalletName,
                })}
              />
            )}
          </div>
          <LoadingState state={claim} />
        </div>
        {isBurnSuccessful && <ClaimRedeem />}
        <ShowLinkToExplorers explorerUrl={explorerUrl} currentTxID={burnTxId} />
      </div>
    </>
  );
}

function getClaimStateTranslation(claimState?: ClaimState) {
  switch (claimState) {
    case ClaimState.RETRIEVING_INFO:
      return Intl.t('index.loading-box.claim-label-retrieving-info');
    case ClaimState.AWAITING_SIGNATURE:
    case ClaimState.READY_TO_CLAIM:
      return Intl.t('index.loading-box.claim-label-awaiting-signature');
    case ClaimState.PENDING:
      return Intl.t('index.loading-box.claim-label-claiming');
    case ClaimState.REJECTED:
      return Intl.t('index.loading-box.claim-label-rejected');
    case ClaimState.ERROR:
      return Intl.t('index.loading-box.claim-label-error');
    default:
      return '';
  }
}

// function getBurnStateTranslation(burnState?: BurnState) {
//   switch (burnState) {
//     case BurnState.AWAITING_INCLUSION:
//       return Intl.t('index.loading-box.burn-label-awaiting-inclusion');
//     case BurnState.PENDING:
//       return Intl.t('index.loading-box.burn-label-included-pending');
//     case BurnState.SUCCESS:
//       return Intl.t('index.loading-box.burn-label-success');
//     case BurnState.SIGNATURE_TIMEOUT:
//       return Intl.t('index.loading-box.burn-label-signature-timeout');
//     case BurnState.REJECTED:
//       return Intl.t('index.loading-box.burn-label-rejected');
//     case BurnState.ERROR:
//       return Intl.t('index.loading-box.burn-label-error');
//     default:
//       return '';
//   }
// }
