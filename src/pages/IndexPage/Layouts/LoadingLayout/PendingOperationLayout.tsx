import { FiX } from 'react-icons/fi';
import { BridgeLayout } from './BridgeLayout';
import { LoadingState } from './LoadingState';
import { RedeemLayout } from './RedeemLayout/RedeemLayout';
import { SuccessLayout } from './SuccessLayout';
import { WarningLayout } from './WarningLayout';
import { useBridgeUtils } from '@/custom/bridge/useBridgeUtils';
import Intl from '@/i18n/i18n';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useOperationStore } from '@/store/store';

export function PendingOperationLayout() {
  const { isMassaToEvm } = useOperationStore();
  const massaToEvm = isMassaToEvm();

  const { closeLoadingBox } = useBridgeUtils();

  const { box } = useGlobalStatusesStore();

  const isBoxSuccess = box === Status.Success;
  const isBoxWarning = box === Status.Warning;
  const isBoxError = box === Status.Error;

  const displaySubtitle = !isBoxSuccess && !isBoxWarning && !isBoxError;

  const isNotProcessing = isBoxSuccess || isBoxWarning || isBoxError;

  function getLoadingBoxHeader() {
    if (isBoxSuccess) return Intl.t('index.loading-box.success');
    if (isBoxError) {
      return massaToEvm
        ? Intl.t('index.loading-box.title-redeem-error')
        : Intl.t('index.loading-box.title-bridge-error');
    }
    if (isBoxWarning) {
      return massaToEvm ? (
        <>
          {Intl.t('index.loading-box.title-redeem-warning-1')}
          <br />
          {Intl.t('index.loading-box.title-redeem-warning-2')}
        </>
      ) : (
        <>
          {Intl.t('index.loading-box.title-bridge-warning-1')}
          <br />
          {Intl.t('index.loading-box.title-bridge-warning-2')}
        </>
      );
    }

    return massaToEvm
      ? Intl.t('index.loading-box.title-redeem')
      : Intl.t('index.loading-box.title-bridge');
  }

  function getLoadingBoxContent() {
    switch (true) {
      case isBoxSuccess:
        return <SuccessLayout />;
      case isBoxWarning:
        return <WarningLayout />;
      case massaToEvm:
        return <RedeemLayout />;
      default:
        return <BridgeLayout />;
    }
  }

  return (
    <div
      className="p-10 max-w-3/12 w-4/12 min-h-96 border border-tertiary rounded-2xl
              bg-secondary/50 text-f-primary"
    >
      {isNotProcessing ? (
        <div className="flex justify-end">
          <button
            className="text-neutral bg-primary rounded-lg text-sm p-1.5 ml-auto inline-flex items-center
                hover:bg-tertiary hover:text-c-primary"
            type="button"
            onClick={closeLoadingBox}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      ) : null}
      <div className="flex flex-col items-center justify-start mb-10">
        <div className="mb-4">
          <LoadingState state={box} size="lg" />
        </div>
        <p className="mas-subtitle pt-6">{getLoadingBoxHeader()}</p>
        {displaySubtitle && (
          <p className="text-xs pb-6">{Intl.t('index.loading-box.subtitle')}</p>
        )}
      </div>
      {getLoadingBoxContent()}
    </div>
  );
}
