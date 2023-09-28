import { ReactNode } from 'react';

import { Clipboard } from '@massalabs/react-ui-kit';
import { FiX, FiPauseCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { Spinner, WarningCheck, SuccessCheck } from '@/components';
import { ILoadingState, StateType } from '@/const';
import { faqURL } from '@/const/faq';
import Intl from '@/i18n/i18n';
import { IToken } from '@/store/accountStore';
import { maskAddress } from '@/utils/massaFormat';

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
  EVMOperationId: string | undefined;
  MassaOperationId: string | undefined;
}

export function LoadingBox(props: ILoadingBoxProps) {
  const { onClose, loading, massaToEvm } = props;

  const IS_BOX_SUCCESS = loading.box === 'success';
  const HAS_SERVER_ERROR = loading.error !== 'none';

  return (
    <>
      <div
        className={`z-10 absolute flex-none max-w-2xl w-full h-[870px] blur-md`}
      />
      <div
        className="absolute z-10 p-10 pb-14 max-w-sm w-full min-h-96 border border-tertiary rounded-2xl
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
          className={`relative flex flex-col items-center justify-start mb-10`}
        >
          <div className="mb-4">{loadingState(loading.box, 'lg')}</div>
          <p className="mas-subtitle pt-6 text-center">
            {IS_BOX_SUCCESS
              ? Intl.t('index.loading-box.success')
              : HAS_SERVER_ERROR
              ? massaToEvm
                ? Intl.t('index.loading-box.title-redeem-error')
                : Intl.t('index.loading-box.title-bridge-error')
              : massaToEvm
              ? Intl.t('index.loading-box.title-redeem')
              : Intl.t('index.loading-box.title-bridge')}
          </p>
          {IS_BOX_SUCCESS || HAS_SERVER_ERROR ? null : (
            <p className="text-xs pb-6">
              {Intl.t('index.loading-box.subtitle')}
            </p>
          )}
        </div>
        {IS_BOX_SUCCESS ? (
          <Ran {...props} />
        ) : HAS_SERVER_ERROR ? (
          <BridgeError {...props} />
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
        <Link
          onClick={onClose}
          to={{
            search: massaToEvm
              ? faqURL.addTokens.addToMetamask
              : faqURL.addTokens.addToMassa,
          }}
          className="underline"
        >
          {Intl.t('unexpected-error.link')}
        </Link>
      </u>
    </div>
  );
}

export function BridgeError(props: ILoadingBoxProps) {
  const { massaToEvm, MassaOperationId, EVMOperationId } = props;

  return (
    <div className="text-center mas-body2">
      <p> {Intl.t('index.loading-box.error-description')}</p>
      <p>
        {Intl.t('index.loading-box.error-expect', {
          wallet: massaToEvm ? 'Metamask' : 'Massa Wallet',
        })}
      </p>
      <strong className="mas-menu">
        {Intl.t('index.loading-box.error-time')}
      </strong>
      <br />
      <p> {Intl.t('index.loading-box.error-contact')}</p>
      <br />
      <u className="mb-4">
        <a href="mailto:support.bridge@massa.net" target="_blank">
          support.bridge@massa.net
        </a>
      </u>

      {massaToEvm && EVMOperationId ? (
        <Clipboard
          customClass={'bg-transparent'}
          displayedContent={`Transaction ID: ${maskAddress(EVMOperationId)}`}
          rawContent={EVMOperationId}
        />
      ) : !massaToEvm && MassaOperationId ? (
        <Clipboard
          customClass={'bg-transparent'}
          displayedContent={`Operation ID: ${maskAddress(MassaOperationId)}`}
          rawContent={MassaOperationId}
        />
      ) : null}
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
    error: <WarningCheck size={size} />,
    success: <SuccessCheck size={size} />,
    none: <FiPauseCircle size={24} />,
  };

  return loading[state];
}
