import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { ReleaseSuccess } from './ReleaseSuccess';
import { ReleaseMasStatus } from '../DaoPage';
import { MinimalLinkExplorer } from '@/components/MinimalLinkExplorer';
import { useFetchBurnedWmasTx } from '@/custom/bridge/useFetchBurnedWmas';
import Intl from '@/i18n/i18n';
import { LoadingState } from '@/pages';
import { Status } from '@/store/globalStatusesStore';
import {
  HistoryOperationStatus,
  OperationHistoryItem,
} from '@/utils/lambdaApi';
import { linkifyBscTxIdToExplo, linkifyMassaOpIdToExplo } from '@/utils/utils';

interface DaoProcessingProps {
  amount: string;
  isBurnSuccess: boolean;
  burnHash: `0x${string}` | undefined;
  setReleaseMasStatus: (step: ReleaseMasStatus) => void;
  resetBurnWrite: () => void;
  releaseMasStatus: ReleaseMasStatus;
  isBurnWriteError: boolean;
}

export function DaoProcessing(props: DaoProcessingProps) {
  const {
    amount,
    isBurnSuccess,
    burnHash: burnTxHash,
    setReleaseMasStatus,
    resetBurnWrite,
    releaseMasStatus,
    isBurnWriteError,
  } = props;

  const [isReleaseSuccess, setIsReleaseSuccess] = useState(false);
  const [releaseOpId, setReleaseOpId] = useState<string>('');

  // lambdaResponse is an [], returning the object directly caused some problems
  // because ts doesn't evaluate {} as falsy
  const { lambdaResponse } = useFetchBurnedWmasTx({
    burnTxHash,
  });

  const lambdaResponseIsEmpty =
    lambdaResponse === undefined || lambdaResponse.length === 0;

  useEffect(() => {
    // Handles release success/failure
    if (!isBurnSuccess) return;
    if (lambdaResponseIsEmpty) return;
    setReleaseOpId(lambdaResponse[0].outputId || '');
    if (
      lambdaResponse[0].isConfirmed === true &&
      releaseMasStatus === ReleaseMasStatus.releasing
    ) {
      setReleaseMasStatus(ReleaseMasStatus.releaseSuccess);
      setIsReleaseSuccess(true);
    }
  }, [
    lambdaResponse,
    setReleaseMasStatus,
    isBurnSuccess,
    lambdaResponseIsEmpty,
    releaseMasStatus,
  ]);

  useEffect(() => {
    // Handles burn success/failure
    if (isBurnSuccess && releaseMasStatus === ReleaseMasStatus.burning) {
      setReleaseMasStatus(ReleaseMasStatus.releasing);
    }
    if (isBurnWriteError) {
      setReleaseMasStatus(ReleaseMasStatus.error);
    }
  }, [isBurnSuccess, setReleaseMasStatus, releaseMasStatus, isBurnWriteError]);

  function reset() {
    resetBurnWrite();
    setReleaseMasStatus(ReleaseMasStatus.init);
    setIsReleaseSuccess(false);
    setReleaseOpId('');
  }

  const releaseExplorerUrl = linkifyMassaOpIdToExplo(releaseOpId);

  const burnExplorerUrl = linkifyBscTxIdToExplo(burnTxHash);

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex w-full justify-end">
        {isReleaseSuccess && (
          <div className="w-fit cursor-pointer hover:bg-tertiary p-2 rounded-xl">
            <FiX className="w-5 h-5" onClick={reset} />
          </div>
        )}
      </div>
      <div className="flex justify-between w-full mb-6 items-center">
        <p className="mas-body-2">
          {Intl.t('dao-maker.burn', {
            state: getBurnedStatus({
              isBurnSuccess,
              isBurnWriteError,
              burnTxHash,
            }),
          })}
        </p>
        <div className="flex items-center gap-4">
          <MinimalLinkExplorer
            explorerUrl={burnExplorerUrl}
            currentTxID={burnTxHash}
          />
          <LoadingState
            state={(isBurnSuccess && Status.Success) || Status.Loading}
          />
        </div>
      </div>
      <div className="flex w-full justify-between mb-6 items-center">
        <p className="mas-body-2">
          {Intl.t('dao-maker.release', {
            state: getReleaseStatus(lambdaResponse, isBurnSuccess),
          })}
        </p>
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
      {isReleaseSuccess && <ReleaseSuccess amount={amount} />}
    </div>
  );
}

interface GetBurnedSuccessArgs {
  isBurnSuccess: boolean;
  isBurnWriteError: boolean;
  burnTxHash: `0x${string}` | undefined;
}

export function getBurnedStatus(args: GetBurnedSuccessArgs): string {
  const { isBurnSuccess, isBurnWriteError, burnTxHash } = args;

  if (!isBurnSuccess) {
    if (burnTxHash === undefined) {
      return Intl.t('dao-maker.burn-including');
    } else if (isBurnWriteError) {
      return Intl.t('dao-maker.burn-including-error');
    } else {
      return Intl.t('dao-maker.burn-included');
    }
  }

  return Intl.t('dao-maker.final');
}

export function getReleaseStatus(
  lambdaResponse: OperationHistoryItem[] | undefined,
  isBurnSuccess: boolean,
): string {
  if (!lambdaResponse || !lambdaResponse.length || !isBurnSuccess) return '';

  const operation = lambdaResponse[0];

  switch (operation.historyStatus) {
    case HistoryOperationStatus.Pending:
      return Intl.t('dao-maker.burn-releasing');
    case HistoryOperationStatus.Done:
      return Intl.t('dao-maker.final');
    case HistoryOperationStatus.Error:
      return Intl.t('dao-maker.burn-releasing-error');
    default:
      return Intl.t('dao-maker.burn-releasing-info');
  }
}
