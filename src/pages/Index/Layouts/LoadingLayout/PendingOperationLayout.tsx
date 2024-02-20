import { FiX } from 'react-icons/fi';
import { BridgeLayout } from './BridgeLayout';
import { LoadingState } from './LoadingState';
import { RedeemLayout } from './RedeemLayout/RedeemLayout';
import { SuccessLayout } from './SuccessLayout';
import { WarningLayout } from './WarningLayout';
import Intl from '@/i18n/i18n';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useOperationStore } from '@/store/store';

export interface LoadingBoxProps {
  onClose: () => void;
  redeemLabel: string;
}

export function PendingOperationLayout(props: LoadingBoxProps) {
  const { onClose } = props;
  const { isMassaToEvm } = useOperationStore();
  const massaToEvm = isMassaToEvm();

  const { box } = useGlobalStatusesStore();

  const IS_BOX_SUCCESS = box === Status.Success;
  const IS_BOX_WARNING = box === Status.Warning;
  const IS_BOX_ERROR = box === Status.Error;

  const displaySubtitle = !IS_BOX_SUCCESS && !IS_BOX_WARNING && !IS_BOX_ERROR;

  const isNotProcessing = IS_BOX_SUCCESS || IS_BOX_WARNING || IS_BOX_ERROR;

  function getLoadingBoxHeader() {
    if (IS_BOX_SUCCESS) return Intl.t('index.loading-box.success');
    else if (IS_BOX_ERROR) {
      return massaToEvm
        ? Intl.t('index.loading-box.title-redeem-error')
        : Intl.t('index.loading-box.title-bridge-error');
    } else if (IS_BOX_WARNING) {
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
      case IS_BOX_SUCCESS:
        return <SuccessLayout {...props} />;
      case IS_BOX_WARNING:
        return <WarningLayout />;
      case massaToEvm:
        return <RedeemLayout {...props} />;
      default:
        return <BridgeLayout />;
    }
  }

  return (
    <div
      className="p-10 max-w-3/12 w-4/12 min-h-96 border border-tertiary rounded-2xl
              bg-secondary/50 text-f-primary"
    >
      {/* TODO: refactor to make exit component */}
      {isNotProcessing ? (
        <div className="flex justify-end">
          <button
            className="text-neutral bg-primary rounded-lg text-sm p-1.5 ml-auto inline-flex items-center
                hover:bg-tertiary hover:text-c-primary"
            type="button"
            onClick={onClose}
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
