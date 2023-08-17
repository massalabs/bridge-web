import { ReactNode } from 'react';

import { FiX, FiPauseCircle } from 'react-icons/fi';

import { Spinner, ErrorCheck, SuccessCheck } from '@/components';
import { ILoadingState, StateType } from '@/const';
import Intl from '@/i18n/i18n';
import { IToken } from '@/store/accountStore';

interface ILoading {
  loading: ReactNode;
  error: ReactNode;
  success: ReactNode;
  none: ReactNode;
}

interface ILoadingBoxProps {
  onClose?: () => void;
  loading: ILoadingState;
  massaToEvm: boolean;
  amount: string;
  redeemSteps: string;
  token: IToken | null;
}

export function LoadingBox(props: ILoadingBoxProps) {
  const { onClose, loading, massaToEvm } = props;

  const IS_BOX_SUCCESS = loading.box === 'success';

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
            {IS_BOX_SUCCESS
              ? Intl.t('index.loading-box.success')
              : massaToEvm
              ? Intl.t('index.loading-box.title-redeem')
              : Intl.t('index.loading-box.title-bridge')}
          </p>
          {IS_BOX_SUCCESS ? null : (
            <p className="text-xs pb-6">
              {Intl.t('index.loading-box.subtitle')}
            </p>
          )}
        </div>
        {IS_BOX_SUCCESS ? (
          <Ran {...props} />
        ) : massaToEvm ? (
          <RunningMassaEVM {...props} />
        ) : (
          <RunningEVMMassa {...props} />
        )}
      </div>
    </>
  );
}

function RunningMassaEVM(props: ILoadingBoxProps) {
  const { loading, redeemSteps } = props;

  return (
    <>
      <div className="flex justify-between mb-6 ">
        <p className="mas-body-2">{Intl.t('index.loading-box.approve')}</p>
        {loadingState(loading.approve)}
      </div>
      <div className="flex justify-between mb-6 ">
        <p className="mas-body-2">{redeemSteps}</p>
        {loadingState(loading.burn)}
      </div>
      <div className="flex justify-between mb-6 ">
        <p className="mas-body-2">{Intl.t('index.loading-box.redeem')}</p>
        {loadingState(loading.redeem)}
      </div>
    </>
  );
}

function RunningEVMMassa(props: ILoadingBoxProps) {
  const { loading } = props;

  return (
    <>
      <div className="flex justify-between mb-6 ">
        <p className="mas-body-2">{Intl.t('index.loading-box.approve')}</p>
        {loadingState(loading.approve)}
      </div>
      <div className="flex justify-between mb-6 ">
        <p className="mas-body-2">{Intl.t('index.loading-box.lock')}</p>
        {loadingState(loading.lock)}
      </div>
      <div className="flex justify-between mb-6 ">
        <p className="mas-body-2">{Intl.t('index.loading-box.mint')}</p>
        {loadingState(loading.mint)}
      </div>
    </>
  );
}

function Ran(props: ILoadingBoxProps) {
  const { massaToEvm, amount, token, onClose } = props;

  const massa = Intl.t('general.massa');
  const sepolia = Intl.t('general.sepolia');

  return (
    <div className="mas-body2 text-center">
      <div className="mb-10">
        {massaToEvm
          ? Intl.t('index.loading-box.redeemed')
          : Intl.t('index.loading-box.bridged')}
        <div className="mas-subtitle p-2">
          {amount} {token?.symbol}
        </div>
        {Intl.t('index.loading-box.from-to', {
          from: massaToEvm ? massa : sepolia,
          to: massaToEvm ? sepolia : massa,
        })}
      </div>
      <p className="mb-6">
        {Intl.t('index.loading-box.check', {
          name: massaToEvm ? 'Metamask' : 'Massa',
        })}
      </p>

      <div className="mb-1">
        {Intl.t('index.loading-box.add-tokens-message')}
      </div>
      <u>
        <a
          onClick={onClose}
          // fill in correct links to FAQ pages
          href={massaToEvm ? 'Add to Metamask' : 'add to massa'}
        >
          {Intl.t('index.loading-box.instructions')}
        </a>
      </u>
    </div>
  );
}

export function BridgeError() {
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
    <div className={`shadow rounded-md w-24 pt-0.5`}>
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

function loadingState(state: StateType, size?: 'md' | 'sm' | 'lg') {
  const loading: ILoading = {
    loading: <Spinner size={size} />,
    error: <ErrorCheck size={size} />,
    success: <SuccessCheck size={size} />,
    none: <FiPauseCircle size={24} />,
  };

  return loading[state];
}
