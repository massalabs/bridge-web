import { Claim } from './ClaimRedeem';
import { LoadingState } from '../LoadingState';
import { LoadingBoxProps } from '../PendingOperationLayout';
import { ShowLinkToExplorers } from '../ShowLinkToExplorers';
import Intl from '@/i18n/i18n';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useBridgeModeStore, useOperationStore } from '@/store/store';
import {
  MASSA_EXPLO_URL,
  MASSA_EXPLO_EXTENSION,
  MASSA_EXPLORER_URL,
  ClaimState,
} from '@/utils/const';

export function RedeemLayout(props: LoadingBoxProps) {
  const { redeemSteps } = props;

  const { burn, approve, claim } = useGlobalStatusesStore();
  const { currentRedeemOperation } = useOperationStore();
  const { isMainnet } = useBridgeModeStore();

  // wait for burn success --> then check additional conditions
  // once burn is a success show claim button + change title & block redeem flow
  const isBurnSuccessful = burn === Status.Success;

  const buildnetExplorerUrl = `${MASSA_EXPLO_URL}${currentRedeemOperation?.inputOpId}${MASSA_EXPLO_EXTENSION}`;
  const mainnetExplorerUrl = `${MASSA_EXPLORER_URL}${currentRedeemOperation?.inputOpId}`;
  const explorerUrl = isMainnet ? mainnetExplorerUrl : buildnetExplorerUrl;

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between">
          <p className="mas-body-2">{Intl.t('index.loading-box.approve')}</p>
          <LoadingState state={approve} />
        </div>
        <div className="flex justify-between">
          <p className="mas-body-2">{redeemSteps}</p>
          <LoadingState state={burn} />
        </div>
        <div className="flex justify-between">
          <p className="mas-body-2">
            {Intl.t('index.loading-box.claim-step', {
              state: getClaimStepTranslation(
                currentRedeemOperation?.claimState,
              ),
            })}
          </p>
          <LoadingState state={claim} />
        </div>
        {isBurnSuccessful && <Claim />}
        <ShowLinkToExplorers
          explorerUrl={explorerUrl}
          currentTxID={currentRedeemOperation?.inputOpId}
        />
      </div>
    </>
  );
}
function getClaimStepTranslation(claimState?: ClaimState) {
  switch (claimState) {
    case ClaimState.RETRIEVING_INFO:
      return Intl.t('index.loading-box.claim-step-retrieving-info');
    case ClaimState.AWAITING_SIGNATURE:
      return Intl.t('index.loading-box.claim-step-awaiting-signature');
    case ClaimState.PENDING:
      return Intl.t('index.loading-box.claim-step-claiming');
    case ClaimState.REJECTED:
      return Intl.t('index.loading-box.claim-step-rejected');
    case ClaimState.ERROR:
      return Intl.t('index.loading-box.claim-step-error');
    default:
      return '';
  }
}
