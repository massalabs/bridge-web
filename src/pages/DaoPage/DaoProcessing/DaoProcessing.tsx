import { useEffect } from 'react';
import { ReleaseMasStatus } from '../DaoPage';
import { handleWMASBridge } from '@/custom/bridge/handlers/handleWmasBridge';
import Intl from '@/i18n/i18n';
import { LoadingState, ShowLinkToExplorers } from '@/pages';
import { Status } from '@/store/globalStatusesStore';
import { useBridgeModeStore } from '@/store/store';

interface DaoProcessingProps {
  isBurnSuccess: boolean;
  burnHash: `0x${string}` | undefined;
  updateReleaseMasStep: (step: ReleaseMasStatus) => void;
  releaseMasStatus: ReleaseMasStatus;
}

export function DaoProcessing(props: DaoProcessingProps) {
  const {
    isBurnSuccess,
    burnHash: burnTxHash,
    updateReleaseMasStep,
    releaseMasStatus,
  } = props;

  const { currentMode } = useBridgeModeStore();

  useEffect(() => {
    if (isBurnSuccess) {
      // still not sure about this
      updateReleaseMasStep(ReleaseMasStatus.burnSuccess);

      // trigger lambda polling function
      handleWMASBridge(burnTxHash);

      // still not sure about this
      updateReleaseMasStep(ReleaseMasStatus.releasing);
    }
  }, [isBurnSuccess]);

  const explorerUrl = `https://${currentMode}.bscscan.com/tx/${burnTxHash}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between mb-6 ">
        <p className="mas-body-2">{Intl.t('dao-maker.burn')}</p>
        {/* Quick loading states, will implement proper logic once flow is complete */}
        <LoadingState
          state={(isBurnSuccess && Status.Success) || Status.Loading}
        />
      </div>
      <div className="flex justify-between mb-6 ">
        <p className="mas-body-2">{Intl.t('dao-maker.release')}</p>
        {/* Quick loading states, will implement proper logic once flow is complete */}
        <LoadingState
          state={
            releaseMasStatus === ReleaseMasStatus.releasing
              ? Status.Loading
              : Status.None
          }
        />
      </div>
      <ShowLinkToExplorers explorerUrl={explorerUrl} currentTxID={burnTxHash} />
    </div>
  );
}
