import { ReactNode } from 'react';

import { FiX, FiPauseCircle } from 'react-icons/fi';

import { Spinner, ErrorCheck, SuccessCheck } from '@/components';
import { ILoadingState, StateType } from '@/const';
import Intl from '@/i18n/i18n';

interface ILoading {
  loading: ReactNode;
  error: ReactNode;
  success: ReactNode;
  none: ReactNode;
}

function loadingState(state: StateType, size?: 'md' | 'sm' | 'lg') {
  const loading: ILoading = {
    loading: <Spinner size={size} />,
    error: <ErrorCheck size={size} />,
    success: <SuccessCheck size={size} />,
    none: <FiPauseCircle size={24} />,
  };

  return loading[state];
}

interface ILoadingBoxProps {
  onClose: () => void;
  loading: ILoadingState;
  massaToEvm: boolean;
}

export function LoadingBox(props: ILoadingBoxProps) {
  const { onClose, loading, massaToEvm } = props;

  return (
    <>
      <div
        className={`z-10 absolute flex-none max-w-2xl w-full h-[870px] blur-md`}
      />
      <div
        className="absolute z-10 p-10 max-w-sm w-full min-h-96 border border-tertiary rounded-2xl
              bg-secondary/50 backdrop-blur-lg text-f-primary"
      >
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
        <div
          className={`relative flex flex-col items-center justify-start pb-10`}
        >
          {loadingState(loading.box, 'lg')}
          <p className="mas-subtitle pt-6">
            {Intl.t('index.loading-box.title')}
          </p>
          <p className="text-xs pb-6">{Intl.t('index.loading-box.subtitle')}</p>
        </div>
        <BridgeFinalStatus loading={loading} massaToEvm={massaToEvm} />
      </div>
    </>
  );
}

export function BridgeFinalStatus({
  loading,
  massaToEvm,
}: {
  loading: ILoadingState;
  massaToEvm: boolean;
}) {
  const massa = Intl.t('general.massa');
  const evm = Intl.t('general.evm');
  const getMassaTokenLink = Intl.t('index.loading-box.massa-tokens-link');
  const getEvmTokenLink = Intl.t('index.loading-box.evm-tokens-link');

  if (loading.bridge === 'success') {
    return (
      <div className="text-center">
        <p>
          {Intl.t('index.loading-box.redirection', {
            direction: massaToEvm ? massa : evm,
          })}
        </p>
        <br />
        <p>{Intl.t('index.loading-box.add-tokens-message')}</p>
        <br />
        <u>
          <a
            href={massaToEvm ? getMassaTokenLink : getEvmTokenLink}
            target="_blank"
          >
            {Intl.t('index.loading-box.add-tokens')}
          </a>
        </u>
      </div>
    );
  } else if (loading.bridge === 'error') {
    return (
      <div className="text-center">
        <p> {Intl.t('index.loading-box.error')}</p>
        <br />
        <u>
          <a href="mailto:support@bridge.massa.net" target="_blank">
            {Intl.t('index.loading-box.massa-support')}
          </a>
        </u>
      </div>
    );
  } else {
    return (
      <>
        <div className="mb-6 flex justify-between">
          <p className="mas-body-2">{Intl.t('index.loading-box.approve')}</p>
          {loadingState(loading.approve)}
        </div>
        <div className="flex justify-between">
          <p className="mas-body-2">{Intl.t('index.loading-box.bridge')}</p>
          {loadingState(loading.aprove)}
        </div>
      </>
    );
  }
}

export function FetchingRound() {
  return (
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-s-success opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-s-success"></span>
    </span>
  );
}

export function FetchingLine() {
  return (
    <div className={`shadow rounded-md w-24 pt-1`}>
      <div className="animate-pulse flex">
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 bg-c-disabled-1 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function FetchingStatus() {
  return (
    <div className="bg-tertiary rounded-full w-fit px-3 pb-0.5 opacity-30">
      {Intl.t('general.loading')}.
    </div>
  );
}
