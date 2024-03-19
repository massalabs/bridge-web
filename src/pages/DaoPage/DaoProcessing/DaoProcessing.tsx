import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { ReleaseMasStatus } from '../DaoPage';
import { useFetchBurnedWmasTx } from '@/custom/bridge/useFetchBurnedWmas';
import Intl from '@/i18n/i18n';
import { LoadingState, ShowLinkToExplorers } from '@/pages';
import { Status } from '@/store/globalStatusesStore';
import { useBridgeModeStore } from '@/store/store';

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

  const explorerUrl = `https://${
    isMainnet ? '' : 'testnet.'
  }bscscan.com/tx/${burnTxHash}`;

  return (
    <div className="flex flex-col gap-6">
      {releaseMasStatus === ReleaseMasStatus.releaseSuccess && (
        <div className="flex w-full justify-end cursor-pointer">
          <FiX
            className="w-5 h-5"
            onClick={() => setReleaseMasStatus(ReleaseMasStatus.init)}
          />
        </div>
      )}
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
        {/* Here I can pass serverState as additional info for user */}
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
      {/* TODO: update hash for when we have outputOpId */}
      <ShowLinkToExplorers explorerUrl={explorerUrl} currentTxID={burnTxHash} />
    </div>
  );
}
