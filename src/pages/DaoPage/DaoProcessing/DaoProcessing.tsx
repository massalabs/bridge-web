import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { ReleaseMasStatus } from '../DaoPage';
import { MinimalLinkExplorer } from '@/components/MinimalLinkExplorer';
import { useFetchBurnedWmasTx } from '@/custom/bridge/useFetchBurnedWmas';
import Intl from '@/i18n/i18n';
import { LoadingState } from '@/pages';
import { Status } from '@/store/globalStatusesStore';
import { linkifyBscTxIdToExplo, linkifyMassaOpIdToExplo } from '@/utils/utils';

interface DaoProcessingProps {
  isBurnSuccess: boolean;
  burnHash: `0x${string}` | undefined;
  setReleaseMasStatus: (step: ReleaseMasStatus) => void;
  releaseMasStatus: ReleaseMasStatus;
  isBurnWriteError: boolean;
}

export function DaoProcessing(props: DaoProcessingProps) {
  const {
    isBurnSuccess,
    burnHash: burnTxHash,
    setReleaseMasStatus,
    releaseMasStatus,
    isBurnWriteError,
  } = props;

  const [isReleaseSuccess, setIsReleaseSuccess] = useState(false);
  const [releaseOpId, setReleaseOpId] = useState<string>('');

  // lambdaReponse is an [], returning the object directly caused some problems
  // because ts doesn't evaluate {} as falsy
  const { lambdaResponse } = useFetchBurnedWmasTx({
    burnTxHash,
  });

  useEffect(() => {
    // Handles release success/failure
    if (!isBurnSuccess) return;
    if (lambdaResponse === undefined || lambdaResponse.length === 0) return;
    setReleaseOpId(lambdaResponse[0].outputId || '');
    if (lambdaResponse[0].isConfirmed === true) {
      setReleaseMasStatus(ReleaseMasStatus.releaseSuccess);
      setIsReleaseSuccess(true);
    }
  }, [lambdaResponse, setReleaseMasStatus, isBurnSuccess]);

  useEffect(() => {
    // Handles burn success/failure
    if (isBurnSuccess && releaseMasStatus === ReleaseMasStatus.burning) {
      setReleaseMasStatus(ReleaseMasStatus.burnSuccess);
      setReleaseMasStatus(ReleaseMasStatus.releasing);
    }
    if (isBurnWriteError) {
      setReleaseMasStatus(ReleaseMasStatus.error);
    }
  }, [isBurnSuccess, setReleaseMasStatus, releaseMasStatus, isBurnWriteError]);

  const releaseExplorerUrl = linkifyMassaOpIdToExplo(releaseOpId);

  const burnExplorerUrl = linkifyBscTxIdToExplo(burnTxHash);

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex w-full justify-end">
        {isReleaseSuccess && (
          <div className="w-fit cursor-pointer hover:bg-tertiary p-2 rounded-xl">
            <FiX
              className="w-5 h-5"
              onClick={() => setReleaseMasStatus(ReleaseMasStatus.init)}
            />
          </div>
        )}
      </div>
      <div className="flex justify-between w-full mb-6 items-center">
        <p className="mas-body-2">{Intl.t('dao-maker.burn')}</p>
        <div className="flex items-center gap-4">
          <MinimalLinkExplorer
            explorerUrl={burnExplorerUrl}
            currentTxID={burnTxHash}
          />
          {/* Quick loading states, will implement proper logic once flow is complete */}
          <LoadingState
            state={(isBurnSuccess && Status.Success) || Status.Loading}
          />
        </div>
      </div>
      <div className="flex w-full justify-between mb-6 items-center">
        <p className="mas-body-2">{Intl.t('dao-maker.release')}</p>

        {/* Quick loading states, will implement proper logic once flow is complete */}
        {/* Here I can pass serverState as additional info for user */}
        <div className="flex items-center gap-4">
          <MinimalLinkExplorer
            explorerUrl={releaseExplorerUrl}
            currentTxID={releaseOpId}
          />
          <LoadingState
            state={(() => {
              switch (releaseMasStatus) {
                case ReleaseMasStatus.releasing:
                  return Status.Loading;
                case ReleaseMasStatus.releaseSuccess:
                  return Status.Success;
                default:
                  return Status.None;
              }
            })()}
          />
        </div>
      </div>
      {isReleaseSuccess && <div>{Intl.t('dao-maker.success')}</div>}
    </div>
  );
}
