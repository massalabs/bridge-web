import { useState, SyntheticEvent, useEffect } from 'react';
import Intl from '@/i18n/i18n';
import {
  Dropdown,
  MassaLogo,
  MassaToken,
  Tag,
  Currency,
  Button,
  toast,
} from '@massalabs/react-ui-kit';
import { FiRepeat, FiX, FiPauseCircle } from 'react-icons/fi';
import { BsCheckLg } from 'react-icons/bs';
import { RxCross2 } from 'react-icons/rx';
import { GetTokensPopUpModal, Spinner } from '@/components';
import { EVM_TO_MASSA, MASSA_TO_EVM, tagTypes } from '@/utils/const';
import { useAccountStore } from '@/store/store';
import { BsDiamondHalf } from 'react-icons/bs';
import { IAccount, IAccountBalanceResponse } from '@massalabs/wallet-provider';
import { forwardBurn, increaseAllowance } from '@/custom/bridge/bridge';
import { TokenPair } from '@/custom/serializable/tokenPair';
import { FetchingLine, FetchingStatus } from './Loading';
import { formatStandard, maskAddress } from '@/utils/massaFormat';
import { useAccount, useBalance, useNetwork } from 'wagmi';

const iconsNetworks = {
  Sepolia: <BsDiamondHalf size={40} />,
  OTHER: <BsDiamondHalf />,
};

const iconsTokens = {
  MASSASTATION: <MassaLogo size={16} />,
  OTHER: <BsDiamondHalf />,
};

export function Connected() {
  return (
    <Tag type={tagTypes.success} content={Intl.t(`index.tag.connected`)} />
  );
}

export function Disconnected() {
  return (
    <Tag type={tagTypes.error} content={Intl.t(`index.tag.not-connected`)} />
  );
}

function SuccessCheck({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  const isSmall = size === 'sm';
  const isMedium = size === 'md';
  const sizeClass = isSmall
    ? 'w-6 h-6'
    : isMedium
    ? 'w-8 h-8'
    : 'w-12 h-12 border-4';

  return (
    <div
      className={`${sizeClass} rounded-full bg-s-success/30 flex justify-center items-center border-none`}
    >
      <BsCheckLg className="text-s-success w-full h-full p-1" />
    </div>
  );
}

function ErrorCheck({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  const isSmall = size === 'sm';
  const isMedium = size === 'md';
  const sizeClass = isSmall
    ? 'w-6 h-6'
    : isMedium
    ? 'w-8 h-8'
    : 'w-12 h-12 border-4';

  return (
    <div
      className={`${sizeClass} rounded-full bg-s-error/30 flex justify-center items-center border-none`}
    >
      <RxCross2 className="text-s-error w-full h-full p-1" />
    </div>
  );
}

export function Index() {
  const [
    accounts,
    tokens,
    getAccounts,
    getTokens,
    account,
    setToken,
    token,
    isFetching,
  ] = useAccountStore((state) => [
    state.accounts,
    state.tokens,
    state.getAccounts,
    state.getTokens,
    state.account,
    state.setToken,
    state.token,
    state.isFetching,
  ]);

  // HOOKS
  const [openTokensModal, setOpenTokensModal] = useState<boolean>(false);
  const [balance, setBalance] = useState<IAccountBalanceResponse>();
  const [amount, setAmount] = useState<number | string | undefined>('');
  const [layout, setLayout] = useState<LayoutType | undefined>(EVM_TO_MASSA);
  const [loading, setLoading] = useState<
    'loading' | 'error' | 'success' | 'none'
  >('none');
  const [approveLoading, setApproveLoading] = useState<
    'loading' | 'error' | 'success' | 'none'
  >('none');
  const [bridgeLoading, setBridgeLoading] = useState<
    'loading' | 'error' | 'success' | 'none'
  >('none');
  const [error, setError] = useState<{ amount: string } | null>(null);

  const isMassaWalletConnected = !!account;

  const [evmWalletConnected, _] = useState<boolean>(true);

  const { chains } = useNetwork();

  const { isConnected: isEvmWalletConnected, address: EvmAddress } =
    useAccount();
  const { data: evmBalanceObject } = useBalance({
    address: EvmAddress,
  });

  const evmBalance = evmBalanceObject?.formatted;

  useEffect(() => {
    getAccounts();
  }, []);

  useEffect(() => {
    getTokens();
  }, [accounts]);

  useEffect(() => {
    fetchBalance(account).then((balance) => setBalance(balance));
  }, [account]);

  function handleToggleLayout() {
    let isMassaToEvm = layout === MASSA_TO_EVM;

    setLayout(isMassaToEvm ? EVM_TO_MASSA : MASSA_TO_EVM);
  }

  function EVMHeader() {
    if (typeof window.ethereum === 'undefined') {
      toast.error(Intl.t(`index.metamask.missing`));
    }
    return (
      <div className="mb-4 flex items-center justify-between">
        <div className="w-1/2">
          <Dropdown
            options={chains.map((chain) => ({
              item: chain.name,
              icon: iconsNetworks['Sepolia'],
            }))}
          />
        </div>
        <div className="flex items-center gap-3">
          <p className="mas-body">EVM wallet</p>
          {isEvmWalletConnected ? <Connected /> : <Disconnected />}
        </div>
      </div>
    );
  }

  function MassaHeader() {
    return (
      <div className="mb-4 flex items-center justify-between">
        <div className="w-1/2">
          <Dropdown
            options={[
              {
                item: 'Massa Buildnet',
                icon: <MassaToken />,
              },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          <p className="mas-body">Massa Wallet</p>
          {isFetching ? (
            <FetchingStatus />
          ) : isMassaWalletConnected ? (
            <Connected />
          ) : (
            <Disconnected />
          )}
        </div>
      </div>
    );
  }

  function EVMMiddle() {
    return (
      <div className="mb-4 flex items-center gap-2">
        <p className="mas-body2">Wallet address:</p>
        <p className="mas-caption">{EvmAddress}</p>
      </div>
    );
  }

  function MassaMiddle() {
    return (
      <div className="mb-4 flex items-center gap-2">
        <p className="mas-body2">Wallet address:</p>
        <div className="mas-caption">
          {isFetching ? <FetchingLine /> : account?.address()}
        </div>
      </div>
    );
  }

  function EVMTokenOptions() {
    return (
      <Dropdown
        select={selectedMassaTokenKey}
        readOnly={layout === MASSA_TO_EVM}
        size="xs"
        options={tokens.map((token) => {
          return {
            item: token.name.slice(0, -2),
            icon: iconsTokens['OTHER'],
            onClick: () => setToken(token),
          };
        })}
      />
    );
  }

  function MassaTokenOptions() {
    return (
      <Dropdown
        select={selectedMassaTokenKey}
        readOnly={layout === EVM_TO_MASSA}
        size="xs"
        options={tokens.map((token) => {
          return {
            item: token.name,
            icon: iconsTokens['MASSASTATION'],
            onClick: () => setToken(token),
          };
        })}
      />
    );
  }

  function EVMFees() {
    return (
      <div>
        <div className="flex items-center gap-2">
          <p className="mas-body2">Total EVM fees:</p>
          <p className="mas-body">{formatStandard(Number(0))}</p>
        </div>
      </div>
    );
  }

  function MassaFees() {
    return (
      <div>
        <div className="flex items-center gap-2">
          <p className="mas-body2">Total Massa fees:</p>
          <p className="mas-body">{formatStandard(Number(0))}</p>
        </div>
      </div>
    );
  }

  function EVMBalance() {
    return (
      <div className="flex items-center gap-2">
        <p className="mas-body2">Balance:</p>
        <p className="mas-body">{formatStandard(Number(evmBalance || 0))}</p>
      </div>
    );
  }

  function MassaBalance() {
    return (
      <div className="flex items-center gap-2">
        <p className="mas-body2">Balance:</p>
        <div className="mas-body">
          {isFetching ? (
            <FetchingLine />
          ) : (
            formatStandard(Number(balance?.candidateBalance || 0))
          )}
        </div>
      </div>
    );
  }

  function LoadingBox() {
    return (
      <>
        <div
          className={`z-10 absolute flex-none max-w-2xl w-full h-[870px] blur-md`}
        />
        <div
          className="absolute z-10 p-10 max-w-sm w-full max-h-96 h-full border border-tertiary rounded-2xl
              bg-secondary/50 backdrop-blur-lg text-f-primary"
        >
          <div className="flex justify-end pb-8">
            <button
              className="text-neutral bg-primary rounded-lg text-sm p-1.5 ml-auto inline-flex items-center
                      hover:bg-tertiary hover:text-c-primary"
              type="button"
              onClick={handleClosePopUp}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <div
            className={`relative flex flex-col items-center justify-start pb-10`}
          >
            {loadingState(loading, 'lg')}
            <p className="mas-subtitle pt-6">
              {Intl.t('index.loading-box.title')}
            </p>
            <p className="text-xs pb-6">
              {Intl.t('index.loading-box.subtitle')}
            </p>
          </div>
          <div className="mb-6 flex justify-between">
            <p className="mas-body-2">{Intl.t('index.loading-box.approve')}</p>
            {loadingState(approveLoading)}
          </div>
          <div className="mb-6 flex justify-between">
            <p className="mas-body-2">{Intl.t('index.loading-box.bridge')}</p>
            {loadingState(bridgeLoading)}
          </div>
        </div>
      </>
    );
  }

  interface ILoading {
    loading: JSX.Element;
    error: JSX.Element;
    success: JSX.Element;
    none: JSX.Element;
  }

  type StateType = 'loading' | 'error' | 'success' | 'none';

  function loadingState(state: StateType, size?: 'md' | 'sm' | 'lg') {
    const loading: ILoading = {
      loading: <Spinner size={size} />,
      error: <ErrorCheck size={size} />,
      success: <SuccessCheck size={size} />,
      none: <FiPauseCircle size={24} />,
    };

    return loading[state];
  }

  interface Layout {
    header: JSX.Element;
    wallet: JSX.Element;
    token: JSX.Element;
    fees: JSX.Element | null;
    balance: JSX.Element;
  }

  // Define the layout types
  type LayoutType = 'massaToEvm' | 'evmToMassa';

  function boxLayout(layout: LayoutType = 'massaToEvm'): {
    up: Layout;
    down: Layout;
  } {
    const layouts = {
      massaToEvm: {
        up: {
          header: <MassaHeader />,
          wallet: <MassaMiddle />,
          token: <MassaTokenOptions />,
          fees: null,
          balance: <MassaBalance />,
        },
        down: {
          header: <EVMHeader />,
          wallet: <EVMMiddle />,
          token: <EVMTokenOptions />,
          fees: <EVMFees />,
          balance: null,
        },
      },
      evmToMassa: {
        up: {
          header: <EVMHeader />,
          wallet: <EVMMiddle />,
          token: <EVMTokenOptions />,
          fees: null,
          balance: <EVMBalance />,
        },
        down: {
          header: <MassaHeader />,
          wallet: <MassaMiddle />,
          token: <MassaTokenOptions />,
          fees: <MassaFees />,
          balance: null,
        },
      },
    };

    return layouts[layout];
  }

  function validateBridge() {
    setError(null);
    if (!amount) {
      setError({ amount: Intl.t('index.approve.error.invalid-amount') });
      return false;
    }

    if (Number(balance?.candidateBalance) < Number(amount)) {
      setError({ amount: Intl.t('index.approve.error.insuficient-funds') });
      return false;
    }

    return true;
  }

  async function handleApprove() {
    setApproveLoading('loading');
    try {
      const maxAmount = BigInt('2') ** BigInt('256') - BigInt('1');
      await increaseAllowance(
        account ?? undefined,
        token?.massaToken ? token.massaToken : '',
        maxAmount,
      );

      setApproveLoading('success');
    } catch (error) {
      console.log(error);
      setApproveLoading('error');
      setBridgeLoading('error');
      setLoading('error');
      if (
        error?.message?.split('message:').pop().trim() !==
        'Unable to unprotect wallet'
      )
        toast.error(Intl.t(`index.approve.error.general`));
      return false;
    }

    return true;
  }

  async function handleBridge() {
    setBridgeLoading('loading');

    try {
      let tokenPairs = new TokenPair(
        token?.massaToken,
        token?.evmToken,
        token?.chainId,
      );

      await forwardBurn(account ?? undefined, tokenPairs);

      setBridgeLoading('success');
      setLoading('success');
      handleTimerClosePopUp();

      toast.success(Intl.t(`index.bridge.success`));
    } catch (error) {
      console.log(error);
      setBridgeLoading('error');
      setLoading('error');
      toast.error(Intl.t(`index.bridge.error.general`));
      return false;
    }

    return true;
  }

  async function fetchBalance(account: IAccount | null) {
    try {
      return await account?.balance();
    } catch (error) {
      console.error('Error while retrieving balance: ', error);
      toast.error(Intl.t(`index.balance.error`));
    }
  }

  const selectedMassaTokenKey: number = parseInt(
    Object.keys(tokens).find(
      (_, idx) => tokens[idx].name.slice(0, -2) === token?.name.slice(0, -2),
    ) || '0',
  );

  function handleClosePopUp() {
    setLoading('none');
    setApproveLoading('none');
    setBridgeLoading('none');
    setAmount('');
  }

  function handleTimerClosePopUp(timer: number = 1500) {
    setTimeout(() => {
      setLoading('none');
      setApproveLoading('none');
      setBridgeLoading('none');
      setAmount('');
    }, timer);
  }

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (!validateBridge()) return;

    setLoading('loading');

    if (layout === MASSA_TO_EVM) {
      const approved = await handleApprove();

      if (approved) handleBridge();
    } else if (layout === EVM_TO_MASSA) {
      // TODO: TO BE IMPLEMENTED
      console.log('TODO: TO BE IMPLEMENTED');
    }
  }

  const isLoading = loading !== 'none' ? 'blur-md' : null;

  return (
    <>
      {isLoading && <LoadingBox />}
      <div
        className={`p-10 max-w-2xl w-full border border-tertiary rounded-2xl
            bg-secondary/50 backdrop-blur-lg text-f-primary ${isLoading}`}
      >
        <div className="p-6 bg-primary rounded-2xl mb-5">
          <p className="mb-4 mas-body">{Intl.t(`index.from`)}</p>
          {boxLayout(layout).up.header}
          {boxLayout(layout).up.wallet}
          <div className="mb-4 flex items-center gap-2">
            <div className="w-full">
              <Currency
                name="amount"
                value={amount}
                onValueChange={(value) => setAmount(value)}
                placeholder={Intl.t(`index.input.placeholder.amount`)}
                suffix=""
                error={error?.amount}
              />
            </div>
            <div className="w-1/3">{boxLayout(layout).up.token}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {evmWalletConnected ? (
                <h3
                  className="mas-h3 text-f-disabled-1 underline cursor-pointer"
                  onClick={() => setOpenTokensModal(true)}
                >
                  Get tokens
                </h3>
              ) : (
                <>
                  <p className="mas-body2">Total fees:</p>
                  <p className="mas-body">{formatStandard(Number(0))}</p>
                </>
              )}
            </div>
            {boxLayout(layout).up.balance}
          </div>
        </div>
        <div className="mb-5 flex justify-center items-center">
          <Button
            variant="toggle"
            onClick={handleToggleLayout}
            customClass={`w-12 h-12 inline-block transition ease-in-out delay-10 ${
              layout === MASSA_TO_EVM ? 'rotate-180' : ''
            }`}
          >
            <FiRepeat size={24} />
          </Button>
        </div>
        <div className="mb-5 p-6 bg-primary rounded-2xl">
          <p className="mb-4 mas-body">{Intl.t(`index.to`)}</p>
          {boxLayout(layout).down.header}
          {boxLayout(layout).down.wallet}
          <div className="mb-4 flex items-center gap-2">
            <div className="w-full">
              <Currency
                placeholder={Intl.t(`index.input.placeholder.receive`)}
                name="receive"
                value={amount}
                onValueChange={(value) => setAmount(value)}
                suffix=""
                error=""
                disable={true}
              />
            </div>
            <div className="w-1/3">{boxLayout(layout).down.token}</div>
          </div>
          <div className="flex justify-between items-center">
            {boxLayout(layout).down.fees}
            {boxLayout(layout).down.balance}
          </div>
        </div>
        <div>
          <p className="mas-caption mb-4">
            {Intl.t(`index.total.approve`, {
              amount: formatStandard(Number(0)),
            })}
          </p>
          <Button onClick={(e) => handleSubmit(e)}>
            {Intl.t(`index.button.bridge`)}
          </Button>
        </div>
      </div>
      {openTokensModal && (
        <GetTokensPopUpModal setOpenModal={setOpenTokensModal} />
      )}
    </>
  );
}
