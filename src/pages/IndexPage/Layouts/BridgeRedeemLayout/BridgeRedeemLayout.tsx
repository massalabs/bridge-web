import { ReactNode, useState } from 'react';
import { Button } from '@massalabs/react-ui-kit';
import { FiArrowRight } from 'react-icons/fi';
import { OperationLayout } from './OperationLayout';
import { ConfirmationLayout } from '../ConfirmationLayout/ConfirmationLayout';
import { BRIDGE_OFF, REDEEM_OFF } from '@/const/env/maintenance';
import { validate } from '@/custom/bridge/handlers/validateTransaction';
import useEvmToken from '@/custom/bridge/useEvmToken';
import {
  ChainContext,
  useEvmChainValidation,
  useMassaNetworkValidation,
} from '@/custom/bridge/useNetworkValidation';
import { useSubmitBridge } from '@/custom/bridge/useSubmitBridge';
import { useSubmitRedeem } from '@/custom/bridge/useSubmitRedeem';
import Intl from '@/i18n/i18n';
import { PendingOperationLayout } from '@/pages';
import { Status } from '@/store/globalStatusesStore';
import {
  useAccountStore,
  useGlobalStatusesStore,
  useOperationStore,
} from '@/store/store';

enum StepsEnum {
  PENDING = 'pending',
  AWAITING_CONFIRMATION = 'confirmation',
}

export function BridgeRedeemLayout() {
  const { tokenBalance } = useEvmToken();
  const { box } = useGlobalStatusesStore();
  const { isMassaToEvm, inputAmount } = useOperationStore();
  const { handleSubmitBridge } = useSubmitBridge();
  const { handleSubmitRedeem } = useSubmitRedeem();
  const { connectedAccount, isFetching } = useAccountStore();
  const [step, setStep] = useState<StepsEnum>(StepsEnum.PENDING);
  const isValidEvmNetwork = useEvmChainValidation(ChainContext.BRIDGE);
  const isValidMassaNetwork = useMassaNetworkValidation();

  const massaToEvm = isMassaToEvm();

  function prevPage() {
    setStep(StepsEnum.PENDING);
  }

  const OperationSteps: Record<StepsEnum, ReactNode> = {
    [StepsEnum.PENDING]: <OperationLayout />,
    [StepsEnum.AWAITING_CONFIRMATION]: (
      <ConfirmationLayout prevPage={prevPage} />
    ),
  };

  function handleSubmission() {
    if (step === StepsEnum.PENDING) {
      const isValid = validate(tokenBalance);
      if (!isValid) return;
      setStep(StepsEnum.AWAITING_CONFIRMATION);
      return;
    }
    massaToEvm ? handleSubmitRedeem() : handleSubmitBridge();
    setStep(StepsEnum.PENDING);
  }

  const isOperationPending = box !== Status.None;
  const blurClass = isOperationPending ? 'blur-md' : '';

  const isButtonDisabled =
    isFetching ||
    !connectedAccount ||
    !isValidEvmNetwork ||
    !inputAmount ||
    !isValidMassaNetwork ||
    (BRIDGE_OFF && !massaToEvm) ||
    (REDEEM_OFF && massaToEvm);

  if (isOperationPending) return <PendingOperationLayout />;

  // Money component formats amount without decimals
  return (
    <>
      <div
        className={`flex flex-col gap-2 p-10 max-w-3xl w-full border border-tertiary rounded-2xl
            bg-secondary/50 text-f-primary mb-5 ${blurClass}`}
      >
        {OperationSteps[step]}
        <div className="mb-5">
          <Button
            disabled={isButtonDisabled}
            posIcon={step === StepsEnum.PENDING && <FiArrowRight />}
            onClick={handleSubmission}
          >
            {step === StepsEnum.PENDING
              ? Intl.t('general.next')
              : massaToEvm
              ? Intl.t('index.button.redeem')
              : Intl.t('index.button.bridge')}
          </Button>
        </div>
      </div>
    </>
  );
}
