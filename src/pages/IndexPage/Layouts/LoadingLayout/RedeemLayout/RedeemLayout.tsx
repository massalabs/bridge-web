import { Tooltip } from '@massalabs/react-ui-kit';
import { ClaimRedeem } from './ClaimRedeem';
import { BridgeLinkExplorer } from '../BridgeLinkExplorer';
import { LoadingState } from '../LoadingState';
import { useConnectorName } from '@/custom/bridge/useConnectorName';
import { useHandleBurnRedeem } from '@/custom/bridge/useHandleBurnRedeem';
import Intl from '@/i18n/i18n';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useOperationStore } from '@/store/store';
import { BurnState, ClaimState } from '@/utils/const';

export function RedeemLayout() {
  const { burn, approve, claim } = useGlobalStatusesStore();
  const { getCurrentRedeemOperation, burnState } = useOperationStore();

  const evmWalletName = useConnectorName();
  const isBurnSuccessful = burn === Status.Success;

  const claimState = getCurrentRedeemOperation()?.claimState;

  const { currentIdToDisplay } = useHandleBurnRedeem();

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
              state: getBurnStateTranslation(burnState),
            })}
          </p>
          <LoadingState state={burn} />
        </div>
        <div className="flex justify-between">
          <div className="mas-body-2 gap-2 flex items-center">
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
        <BridgeLinkExplorer currentTxID={currentIdToDisplay} />
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

function getBurnStateTranslation(burnState?: BurnState) {
  switch (burnState) {
    case BurnState.AWAITING_INCLUSION:
      return Intl.t('index.loading-box.burn-label-awaiting-inclusion');
    case BurnState.PENDING:
      return Intl.t('index.loading-box.burn-label-included-pending');
    case BurnState.SUCCESS:
      return Intl.t('index.loading-box.burn-label-success');
    case BurnState.SIGNATURE_TIMEOUT:
      return Intl.t('index.loading-box.burn-label-signature-timeout');
    case BurnState.REJECTED:
      return Intl.t('index.loading-box.burn-label-rejected');
    case BurnState.ERROR:
      return Intl.t('index.loading-box.burn-label-error');
    default:
      return '';
  }
}
