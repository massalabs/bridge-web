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
} from '@/utils/const';

export function RedeemLayout(props: LoadingBoxProps) {
  const { redeemSteps } = props;

  const { burn, approve, claim } = useGlobalStatusesStore();
  const { burnTxId, currentRedeemOperation } = useOperationStore();
  const { isMainnet } = useBridgeModeStore();

  // wait for burn success --> then check additional conditions
  // once burn is a success show claim button + change title & block redeem flow
  const isBurnSuccessful = burn === Status.Success;

  const buildnetExplorerUrl = `${MASSA_EXPLO_URL}${burnTxId}${MASSA_EXPLO_EXTENSION}`;
  const mainnetExplorerUrl = `${MASSA_EXPLORER_URL}${burnTxId}`;
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
                currentRedeemOperation?.claimStep || ClaimSteps.None,
              ),
            })}
          </p>
          <LoadingState state={claim} />
        </div>
        {isBurnSuccessful && <Claim />}
        <ShowLinkToExplorers explorerUrl={explorerUrl} currentTxID={burnTxId} />
      </div>
    </>
  );
}
function getClaimStepTranslation(claimStep: ClaimSteps) {
  switch (claimStep) {
    case ClaimSteps.RetrievingInfo:
      return Intl.t('index.loading-box.claim-step-retrieving-info');
    case ClaimSteps.AwaitingSignature:
      return Intl.t('index.loading-box.claim-step-awaiting-signature');
    case ClaimSteps.Claiming:
      return Intl.t('index.loading-box.claim-step-claiming');
    case ClaimSteps.Reject:
      return Intl.t('index.loading-box.claim-step-rejected');
    case ClaimSteps.Error:
      return Intl.t('index.loading-box.claim-step-error');
    case ClaimSteps.None:
    default:
      return '';
  }
}

export const enum ClaimSteps {
  None,
  RetrievingInfo,
  AwaitingSignature,
  Claiming,
  Error,
  Reject,
}
