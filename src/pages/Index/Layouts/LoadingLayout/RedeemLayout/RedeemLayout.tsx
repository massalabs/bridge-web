import { useState } from 'react';

import { Claim } from './ClaimRedeem';
import { LoadingBoxProps } from '../LoadingLayout';
import { loadingState } from '../LoadingState';
import { ShowOperationId } from '../ShowOperationId';
import Intl from '@/i18n/i18n';
import { loadingStates } from '@/utils/const';

export function RedeemLayout({ ...props }: LoadingBoxProps) {
  const { loading, redeemSteps, setLoading, operationId, amount, decimals } =
    props;

  const [claimStep, setClaimStep] = useState(ClaimSteps.None);
  // wait for burn success --> then check additional conditions
  // once burn is a success show claim button + change title & block redeem flow
  const isBurnSuccessfull = loading.burn === loadingStates.success;

  const claimArgs = {
    loading,
    setClaimStep,
    setLoading,
    operationId,
    amount,
    decimals,
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between">
          <p className="mas-body-2">{Intl.t('index.loading-box.approve')}</p>
          {loadingState(loading.approve)}
        </div>
        <div className="flex justify-between">
          <p className="mas-body-2">{redeemSteps}</p>
          {loadingState(loading.burn)}
        </div>
        <div className="flex justify-between">
          <p className="mas-body-2">
            {Intl.t('index.loading-box.claim-step', {
              state: getClaimStepTranslation(claimStep),
            })}
          </p>
          {loadingState(loading.claim)}
        </div>
        {isBurnSuccessfull && <Claim {...claimArgs} />}
        <ShowOperationId {...props} />
      </div>
    </>
  );
}
function getClaimStepTranslation(claimStep: ClaimSteps) {
  switch (claimStep) {
    case ClaimSteps.None:
      return Intl.t('index.loading-box.claim-step-none');
    case ClaimSteps.RetrievingInfo:
      return Intl.t('index.loading-box.claim-step-retrieving-info');
    case ClaimSteps.AwaitingSignature:
      return Intl.t('index.loading-box.claim-step-awaiting-signature');
    case ClaimSteps.Claiming:
      return Intl.t('index.loading-box.claim-step-claiming');
  }
}

export const enum ClaimSteps {
  None,
  RetrievingInfo,
  AwaitingSignature,
  Claiming,
}
