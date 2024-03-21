import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { ReleaseMasStatus } from '../DaoPage';
import { MinimalLinkExplorer } from '@/components/MinimalLinkExplorer';
import { useFetchBurnedWmasTx } from '@/custom/bridge/useFetchBurnedWmas';
import Intl from '@/i18n/i18n';
import { LoadingState } from '@/pages';
import { Status } from '@/store/globalStatusesStore';
import { useBridgeModeStore } from '@/store/store';
import {
  MASSA_EXPLORER_URL,
  MASSA_EXPLO_EXTENSION,
  MASSA_EXPLO_URL,
} from '@/utils/const';

interface DaoProcessingProps {
  isBurnSuccess: boolean;
  burnHash: `0x${string}` | undefined;
  setReleaseMasStatus: (step: ReleaseMasStatus) => void;
  releaseMasStatus: ReleaseMasStatus;
}

export function DaoProcessing(props: DaoProcessingProps) {
  const {
    isBurnSuccess,
    burnHash: burnTxHash,
    setReleaseMasStatus,
    releaseMasStatus,
  } = props;

  // lambdaReponse is an [], returning the object directly caused some problems
  // because ts doesn't evaluate {} as falsy
  const { lambdaResponse } = useFetchBurnedWmasTx({
    burnTxHash,
  });

  useEffect(() => {
    if (!isBurnSuccess) return;

    if (lambdaResponse === undefined || lambdaResponse.length === 0) return;

    if (lambdaResponse[0].isConfirmed === false) {
      // TBD: iF states can be simplified
      setReleaseMasStatus(ReleaseMasStatus.releasing);
    } else {
      setReleaseMasStatus(ReleaseMasStatus.releaseSuccess);
    }
  }, [lambdaResponse, setReleaseMasStatus, isBurnSuccess]);

  useEffect(() => {
    // Can be replaced if status is set directly in useBurnWMAS
    if (isBurnSuccess && releaseMasStatus === ReleaseMasStatus.burning) {
      setReleaseMasStatus(ReleaseMasStatus.burnSuccess);
    }
  }, [isBurnSuccess, setReleaseMasStatus]);

  const { isMainnet: getIsMainnet } = useBridgeModeStore();

  const isMainnet = getIsMainnet();

  const burnExplorerUrl = `https://${
    isMainnet ? '' : 'testnet.'
  }bscscan.com/tx/${burnTxHash}`;

  const releaseExplorerUrl = isMainnet
    ? `${MASSA_EXPLORER_URL}${lambdaResponse && lambdaResponse[0]?.outputId}`
    : `${MASSA_EXPLO_URL}${
        lambdaResponse && lambdaResponse[0]?.outputId
      }${MASSA_EXPLO_EXTENSION}`;

  const isReleaseSuccess = releaseMasStatus === ReleaseMasStatus.releaseSuccess;

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
          {' '}
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
            currentTxID={lambdaResponse && lambdaResponse[0]?.outputId}
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
