import { ReactNode, useState } from 'react';
import { Button } from '@massalabs/react-ui-kit';
import { FeesEstimation } from './FeesEstimation';
import { OperationLayout } from './OperationLayout';
import { ConfirmationLayout } from '../ConfirmationLayout/ConfirmationLayout';
import useEvmToken from '@/custom/bridge/useEvmToken';
import { useSubmitBridge } from '@/custom/bridge/useSubmitBridge';
import { useSubmitRedeem } from '@/custom/bridge/useSubmitRedeem';
import Intl from '@/i18n/i18n';
import { PendingOperationLayout } from '@/pages';
import { Status } from '@/store/globalStatusesStore';
import { useGlobalStatusesStore, useOperationStore } from '@/store/store';

interface BridgeRedeemProps {
  isBlurred: string;
  isButtonDisabled: boolean;
}

enum StepsEnum {
  PENDING = 'pending',
  AWAITING_CONFIRMATION = 'confirmation',
}

export function BridgeRedeemLayout(props: BridgeRedeemProps) {
  const { isBlurred, isButtonDisabled } = props;

  const { tokenBalance: _tokenBalanceEVM } = useEvmToken();
  const { box } = useGlobalStatusesStore();
  const { isMassaToEvm, setInputAmount } = useOperationStore();

  const massaToEvm = isMassaToEvm();

  const { handleSubmitBridge } = useSubmitBridge();
  const { handleSubmitRedeem } = useSubmitRedeem();

  const [step, setStep] = useState<StepsEnum>(StepsEnum.PENDING);
  const [cta, setCTA] = useState<string>(Intl.t('general.next'));

  function prevPage() {
    setStep(StepsEnum.PENDING);
    setCTA(Intl.t('general.next'));
  }

  const OperationSteps: Record<StepsEnum, ReactNode> = {
    [StepsEnum.PENDING]: <OperationLayout />,
    [StepsEnum.AWAITING_CONFIRMATION]: (
      <ConfirmationLayout prevPage={prevPage} />
    ),
  };

  function handleSubmission() {
    if (step === StepsEnum.PENDING) {
      setStep(StepsEnum.AWAITING_CONFIRMATION);
      setCTA(
        massaToEvm
          ? Intl.t('index.button.redeem')
          : Intl.t('index.button.bridge'),
      );
      return;
    }
    massaToEvm ? handleSubmitRedeem() : handleSubmitBridge();
    // sets inputAmount to undefined for next transfer
    setInputAmount(undefined);
  }

  const isOperationPending = box !== Status.None;

  if (isOperationPending) return <PendingOperationLayout />;

  // Money component formats amount without decimals
  return (
    <>
      <div
        className={`p-10 max-w-3xl w-full border border-tertiary rounded-2xl
            bg-secondary/50 text-f-primary mb-5 ${isBlurred}`}
      >
        {OperationSteps[step]}
        <div className="mb-5">
          <Button disabled={isButtonDisabled} onClick={handleSubmission}>
            {cta}
          </Button>
        </div>
        <FeesEstimation />
      </div>
    </>
  );
}
