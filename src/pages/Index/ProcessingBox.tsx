import { ReactNode } from 'react';

import { Button, Clipboard } from '@massalabs/react-ui-kit';
import { FiX, FiPauseCircle, FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';

import { Spinner, ErrorCheck, WarningCheck, SuccessCheck } from '@/components';
import { ILoadingState, StateType } from '@/const';
import { faqURL } from '@/const/faq';
import { handleClaimRedeem } from '@/custom/bridge/handlers/handleClaimRedeem';
import Intl from '@/i18n/i18n';
import { IToken } from '@/store/accountStore';
import { useAccountStore } from '@/store/store';
import { maskAddress } from '@/utils/massaFormat';

interface ILoading {
  loading: ReactNode;
  error: ReactNode;
  warning: ReactNode;
  success: ReactNode;
  none: ReactNode;
}

interface ILoadingBoxProps {
  onClose: () => void;
  loading: ILoadingState;
  setLoading: (loading: ILoadingState) => void;
  massaToEvm: boolean;
  amount: string;
  redeemSteps: string;
  token: IToken | null;
  operationId: string | undefined;
}

export function ProcessingBox(props: ILoadingBoxProps) {
  const { onClose, loading, massaToEvm } = props;

  // TODO: change redeem title flow to show : burn successful + one last step to claim

  const IS_BOX_SUCCESS = loading.box === 'success';
  const IS_BOX_WARNING = loading.box === 'warning';
  const IS_BOX_ERROR = loading.box === 'error';
  const IS_GLOBAL_ERROR = loading.error !== 'none';
  // const IS_BURN_SUCCESS = loading.burn === 'success';

  const displaySubtitle =
    !IS_BOX_SUCCESS && !IS_GLOBAL_ERROR && !IS_BOX_WARNING && !IS_BOX_ERROR;

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
        return <GlobalError />;
      case IS_BOX_SUCCESS:
        return <Success {...props} />;
      case IS_BOX_WARNING:
        return <Warning {...props} />;
      case massaToEvm:
        return <Redeem {...props} />;
      default:
        return <Bridge {...props} />;
    }
  }

  const isNotProcessing =
    IS_BOX_SUCCESS || IS_GLOBAL_ERROR || IS_BOX_WARNING || IS_BOX_ERROR;

  // rendering layout
  return (
    <div
      className="p-10 w-4/12 min-w-fit min-h-96 border border-tertiary rounded-2xl
              bg-secondary/50 text-f-primary bg-purple-500"
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

function Redeem(props: ILoadingBoxProps) {
  const { loading, redeemSteps, setLoading, operationId } = props;

  const { address: evmAddress } = useAccount();

  const [connectedAccount] = useAccountStore((state) => [
    state.connectedAccount,
  ]);

  // wait for burn success
  // once burn is a success show claim button + change title & block redeem flow
  const isBurnSuccessfull = loading.burn === 'success';

  async function _handleClaimRedeem() {
    setLoading({ claim: 'loading' });

    const claimArgs = {
      evmAddress,
      massaAddress: connectedAccount?.address(),
      operationId,
    };

    // TODO: implement interval to check if claim is successful
    const claim = await handleClaimRedeem({ ...claimArgs });
    if (claim) {
      setLoading({ box: 'success', claim: 'success' });
    } else {
      setLoading({ box: 'error', claim: 'error' });
    }
  }
  return (
    <>
      {isBurnSuccessfull ? (
        <div className="flex w-full justify-center">
          <div className="flex flex-col gap-6 w-4/5 items-center ">
            <div className="flex flex-col gap-4 justify-center">
              <p className="flex mas-body-2 text-center">
                One last step remains to finalize the redeem. <br />
                To receive [WETH] on [network name] you must sign a transaction.
              </p>
              <div className="flex w-full justify-between">
                <p className="mas-body-2">
                  {Intl.t('index.loading-box.claim')}
                </p>
                {loadingState(loading.claim)}
              </div>
            </div>
            <Button
              onClick={() => {
                _handleClaimRedeem();
              }}
            >
              {Intl.t('index.loading-box.claim')}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between mb-6 ">
            <p className="mas-body-2">{Intl.t('index.loading-box.approve')}</p>
            {loadingState(loading.approve)}
          </div>
          <div className="flex justify-between mb-6 ">
            <p className="mas-body-2">{redeemSteps}</p>
            {loadingState(loading.burn)}
          </div>
        </>
      )}
      <ShowOperationId {...props} />
    </>
  );
}

function Bridge(props: ILoadingBoxProps) {
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
      <ShowOperationId {...props} />
    </>
  );
}

function Success(props: ILoadingBoxProps) {
  const { massaToEvm, amount, token, onClose } = props;

  const massa = Intl.t('general.massa');
  const sepolia = Intl.t('general.sepolia');

  return (
    <div className="mas-body2 text-center">
      <div className="mb-1">
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
      <p className="mb-1">
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

// Remove if not used
export function GlobalError() {
  return (
    <div className="text-center mas-body2">
      <p> {Intl.t('index.loading-box.error-something')}</p>
      <p> {Intl.t('index.loading-box.error-drop')}</p>
      <br />
      <u>
        <a href="mailto:support.bridge@massa.net" target="_blank">
          support.bridge@massa.net
        </a>
      </u>
    </div>
  );
}

export function Warning(props: ILoadingBoxProps) {
  const { massaToEvm } = props;

  return (
    <div className="text-center">
      <p>{Intl.t('index.loading-box.warning-description')}</p>
      <p>
        {Intl.t('index.loading-box.warning-expect', {
          wallet: massaToEvm ? 'Metamask' : 'Massa Wallet',
        })}
      </p>
      <p className="mas-menu font-bold">
        {Intl.t('index.loading-box.warning-time')}
      </p>
      <p>{Intl.t('index.loading-box.warning-contact')}</p>
      <u className="mb-2">
        <a href="mailto:support.bridge@massa.net" target="_blank">
          support.bridge@massa.net
        </a>
      </u>
      <ShowOperationId {...props} />
    </div>
  );
}

export function ShowOperationId(props: ILoadingBoxProps) {
  const { operationId, massaToEvm } = props;

  const smartExplorerUrl = massaToEvm
    ? `https://explorer.massa.net/operation/${operationId}`
    : `https://sepolia.etherscan.io/tx/${operationId}`;

  const _openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noreferrer');
  };

  return (
    operationId && (
      <div className="flex align-middle items-center w-full justify-center">
        <div className="mb-1">
          {massaToEvm
            ? `${Intl.t('index.loading-box.operation')}:`
            : `${Intl.t('index.loading-box.transaction')}:`}
        </div>
        <div className="w-30">
          <Clipboard
            customClass={'bg-transparent w-20'}
            displayedContent={maskAddress(operationId)}
            rawContent={operationId}
          />
        </div>
        <div>
          <Button
            variant="icon"
            onClick={() => _openInNewTab(smartExplorerUrl)}
          >
            <FiExternalLink size={18} />
          </Button>
        </div>
      </div>
    )
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
    warning: <WarningCheck size={size} />,
    success: <SuccessCheck size={size} />,
    none: <FiPauseCircle size={24} />,
  };

  return loading[state];
}
