import { FiX } from 'react-icons/fi';

import { BridgeLayout } from './BridgeLayout';
import { GlobalErrorLayout } from './GlobalErrorLayout';
import { loadingState } from './LoadingState';
import { RedeemLayout } from './RedeemLayout/RedeemLayout';
import { SuccessLayout } from './SuccessLayout';
import { WarningLayout } from './WarningLayout';
import { ILoadingState } from '@/const';
import Intl from '@/i18n/i18n';

export interface ILoadingBoxProps {
  onClose: () => void;
  loading: ILoadingState;
  setLoading: (loading: ILoadingState) => void;
  massaToEvm: boolean;
  amount: string;
  redeemSteps: string;
  operationId: string | undefined;
  decimals: number;
}

export function LoadingLayout(props: ILoadingBoxProps) {
  const { onClose, loading, massaToEvm } = props;

  // TODO: change redeem title flow to show : burn successful + one last step to claim

  const IS_BOX_SUCCESS = loading.box === 'success';
  const IS_BOX_WARNING = loading.box === 'warning';
  const IS_BOX_ERROR = loading.box === 'error';
  const IS_GLOBAL_ERROR = loading.error !== 'none';
  // const IS_BURN_SUCCESS = loading.burn === 'success';

  const displaySubtitle =
    !IS_BOX_SUCCESS && !IS_GLOBAL_ERROR && !IS_BOX_WARNING && !IS_BOX_ERROR;

  const isNotProcessing =
    IS_BOX_SUCCESS || IS_GLOBAL_ERROR || IS_BOX_WARNING || IS_BOX_ERROR;

  function _getLoadingBoxHeader() {
    // change title here
    if (IS_BOX_SUCCESS) return Intl.t('index.loading-box.success');
    else if (IS_GLOBAL_ERROR || IS_BOX_ERROR) {
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

  function _getLoadingBoxContent() {
    switch (true) {
      case IS_GLOBAL_ERROR:
        return <GlobalErrorLayout />;
      case IS_BOX_SUCCESS:
        return <SuccessLayout {...props} />;
      case IS_BOX_WARNING:
        return <WarningLayout {...props} />;
      case massaToEvm:
        return <RedeemLayout {...props} />;
      default:
        return <BridgeLayout {...props} />;
    }
  }

  return (
    <div
      className="p-10 w-4/12 min-w-fit min-h-96 border border-tertiary rounded-2xl
              bg-secondary/50 text-f-primary"
    >
      {/* TODO: refactor to make exit component */}
      {isNotProcessing ? (
        <div className="flex justify-end pb-8">
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
      <div
        className={`relative flex flex-col items-center justify-start mb-10`}
      >
        <div className="mb-4">{loadingState(loading.box, 'lg')}</div>
        <p className="mas-subtitle pt-6 text-center">
          {_getLoadingBoxHeader()}
        </p>
        {displaySubtitle && (
          <p className="text-xs pb-6">{Intl.t('index.loading-box.subtitle')}</p>
        )}
      </div>
      {_getLoadingBoxContent()}
    </div>
  );
}
