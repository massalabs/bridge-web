import { useState, SyntheticEvent, useEffect, ReactNode } from 'react';
import Intl from '@/i18n/i18n';
import {
  Dropdown,
  MassaLogo,
  MassaToken,
  Currency,
  Button,
  toast,
} from '@massalabs/react-ui-kit';
import { FiRepeat } from 'react-icons/fi';
import { BsDiamondHalf } from 'react-icons/bs';
import { GetTokensPopUpModal, Connected, Disconnected } from '@/components';
import { EVM_TO_MASSA, MASSA_TO_EVM } from '@/utils/const';
import { useAccountStore } from '@/store/store';
import { IAccountBalanceResponse } from '@massalabs/wallet-provider';
import { forwardBurn, increaseAllowance } from '@/custom/bridge/bridge';
import { TokenPair } from '@/custom/serializable/tokenPair';
import { FetchingLine, FetchingStatus, LoadingBox } from './Loading';
import { formatStandard } from '@/utils/massaFormat';
import useEvmBridge from '@/useEvmBridge';
import { useAccount, useNetwork, useFeeData } from 'wagmi';
import { LayoutType, ILoadingState } from '@/const';
import { fetchBalance } from '@/bridge';

const iconsNetworks = {
  Sepolia: <BsDiamondHalf size={40} />,
  OTHER: <BsDiamondHalf />,
};

const iconsTokens = {
  MASSASTATION: <MassaLogo size={16} />,
  OTHER: <BsDiamondHalf />,
};

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
  const [error, setError] = useState<{ amount: string } | null>(null);
  const [evmWalletConnected, _] = useState<boolean>(true);

  const [loading, _setLoading] = useState<ILoadingState>({
    box: 'none',
    approve: 'none',
    bridge: 'none',
  });

  function setLoading(state: ILoadingState) {
    _setLoading((prevState) => {
      return { ...prevState, ...state };
    });
  }

  const isMassaWalletConnected = !!account;

  const { chains } = useNetwork();
  const { data: evmFeeData, isLoading: isLoadingEVMFeeData } = useFeeData();
  const { isConnected: isEvmWalletConnected, address: evmAddress } =
    useAccount();

  const { evmTokenBalance, handleBridgeEvm, setEvmAmountToBridge } =
    useEvmBridge({ setLoading });

  useEffect(() => {
    getAccounts();
  }, []);

  useEffect(() => {
    getTokens();
  }, [accounts]);

  useEffect(() => {
    fetchBalance(account).then((balance) => setBalance(balance));
  }, [account]);

  useEffect(() => {
    if (amount) setEvmAmountToBridge(`${amount}`);
  }, [amount]);

  function handleToggleLayout() {
    let isMassaToEvm = layout === MASSA_TO_EVM;
    setLayout(isMassaToEvm ? EVM_TO_MASSA : MASSA_TO_EVM);
  }

  function EVMHeader() {
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
        <p className="mas-caption">{evmAddress}</p>
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
          <div className="mas-body">
            {isLoadingEVMFeeData ? (
              <FetchingLine />
            ) : (
              evmFeeData?.formatted.maxFeePerGas
            )}
          </div>
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
        <p className="mas-body">
          {formatStandard(Number(evmTokenBalance || 0))}
        </p>
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

  interface Layout {
    header: ReactNode;
    wallet: ReactNode;
    token: ReactNode;
    fees: ReactNode;
    balance: ReactNode;
  }

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
    setLoading({
      approve: 'loading',
    });
    try {
      const maxAmount = BigInt('2') ** BigInt('256') - BigInt('1');
      await increaseAllowance(
        account ?? undefined,
        token?.massaToken ? token.massaToken : '',
        maxAmount,
      );

      setLoading({
        approve: 'success',
      });
    } catch (error) {
      console.log(error);
      setLoading({
        approve: 'error',
        bridge: 'error',
        box: 'error',
      });

      if (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        error?.message?.split('message:').pop().trim() !==
        'Unable to unprotect wallet'
      )
        toast.error(Intl.t(`index.approve.error.general`));
      return false;
    }

    return true;
  }

  async function handleBridge() {
    setLoading({
      bridge: 'loading',
    });

    try {
      let tokenPairs = new TokenPair(
        token?.massaToken,
        token?.evmToken,
        token?.chainId,
      );

      await forwardBurn(account ?? undefined, tokenPairs);

      setLoading({
        bridge: 'success',
        box: 'success',
      });
      handleTimerClosePopUp();

      toast.success(Intl.t(`index.bridge.success`));
    } catch (error) {
      console.log(error);
      setLoading({
        bridge: 'error',
        box: 'error',
      });

      toast.error(Intl.t(`index.bridge.error.general`));
      return false;
    }

    return true;
  }

  const selectedMassaTokenKey: number = parseInt(
    Object.keys(tokens).find(
      (_, idx) => tokens[idx].name.slice(0, -2) === token?.name.slice(0, -2),
    ) || '0',
  );

  function handleClosePopUp() {
    setLoading({
      box: 'none',
      approve: 'none',
      bridge: 'none',
    });
    setAmount('');
  }

  function handleTimerClosePopUp(timer = 1500) {
    setTimeout(() => {
      setLoading({
        box: 'none',
        approve: 'none',
        bridge: 'none',
      });
      setAmount('');
    }, timer);
  }

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (!validateBridge()) return;

    setLoading({
      box: 'loading',
    });

    if (layout === MASSA_TO_EVM) {
      // Allowance
      const approved = await handleApprove();
      if (approved) handleBridge();
    } else if (layout === EVM_TO_MASSA) {
      handleBridgeEvm(BigInt(amount ?? 0));
    }
  }

  const isLoading = loading.box !== 'none' ? 'blur-md' : null;

  return (
    <>
      {isLoading && (
        <LoadingBox
          onClose={handleClosePopUp}
          loading={loading.box}
          approveLoading={loading.approve}
          bridgeLoading={loading.bridge}
        />
      )}
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
                disabled={true}
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
          <Button onClick={(e) => handleSubmit(e)}>
            {Intl.t(`index.button.bridge`)}
          </Button>
        </div>
      </div>
      {openTokensModal && (
        <GetTokensPopUpModal
          setOpenModal={setOpenTokensModal}
          layout={layout}
        />
      )}
    </>
  );
}
