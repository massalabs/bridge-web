import { useState } from 'react';

import { Claim } from './ClaimRedeem';
import { LoadingBoxProps } from '../LoadingLayout';
import { LoadingState } from '../LoadingState';
import { ShowLinkToExplorers } from '../ShowOperationId';
import Intl from '@/i18n/i18n';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useBridgeModeStore } from '@/store/store';

export function RedeemLayout({ ...props }: LoadingBoxProps) {
  const { redeemSteps } = props;

  const { burn, approve, claim } = useGlobalStatusesStore();

  const [claimStep, setClaimStep] = useState(ClaimSteps.None);

  // wait for burn success --> then check additional conditions
  // once burn is a success show claim button + change title & block redeem flow
  const isBurnSuccessful = burn === Status.Success;

  const claimArgs = {
    claimStep,
    setClaimStep,
  };

  const { isMainnet } = useBridgeModeStore();

  // This link is only rendered on Mainnet mode
  const explorerUrl = `https://explorer.massa.net/operation/${operationId}`;

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
              state: getClaimStepTranslation(claimStep),
            })}
          </p>
          <LoadingState state={claim} />
        </div>
        {isBurnSuccessful && <Claim {...claimArgs} />}
        {isMainnet && (
          <ShowLinkToExplorers {...props} explorerUrl={explorerUrl} />
        )}
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
