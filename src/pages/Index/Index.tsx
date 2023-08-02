import { useState, SyntheticEvent, useEffect, ReactNode } from 'react';

import {
  Dropdown,
  MassaLogo,
  MassaToken,
  Currency,
  Button,
  toast,
  Tooltip,
} from '@massalabs/react-ui-kit';
import { providers } from '@massalabs/wallet-provider';
import { BsDiamondHalf } from 'react-icons/bs';
import { FiRepeat } from 'react-icons/fi';
import { parseUnits } from 'viem';
import {
  useAccount,
  useNetwork,
  useFeeData,
  useWaitForTransaction,
  useToken,
} from 'wagmi';

import { FetchingLine, FetchingStatus, LoadingBox } from './Loading';
import {
  GetTokensPopUpModal,
  Connected,
  Disconnected,
  NoAccounts,
  NotInstalled,
} from '@/components';
import { LayoutType, ILoadingState, MASSA_STATION, U256_MAX } from '@/const';
import { forwardBurn, increaseAllowance } from '@/custom/bridge/bridge';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
import { TokenPair } from '@/custom/serializable/tokenPair';
import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';
import { EVM_TO_MASSA, MASSA_TO_EVM } from '@/utils/const';
import { formatStandard } from '@/utils/massaFormat';
import { formatAmount } from '@/utils/parseAmount';

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
    setStationInstalled,
    isStationInstalled,
  ] = useAccountStore((state) => [
    state.accounts,
    state.tokens,
    state.getAccounts,
    state.getTokens,
    state.account,
    state.setToken,
    state.token,
    state.isFetching,
    state.setStationInstalled,
    state.isStationInstalled,
  ]);

  // HOOKS
  const [openTokensModal, setOpenTokensModal] = useState<boolean>(false);
  const [amount, setAmount] = useState<string | undefined>('');
  const [layout, setLayout] = useState<LayoutType | undefined>(EVM_TO_MASSA);
  const [error, setError] = useState<{ amount: string } | null>(null);

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

  const hasNoAccounts = accounts?.length <= 0;

  const { chains } = useNetwork();
  const { data: evmFeeData, isLoading: isLoadingEVMFeeData } = useFeeData();
  const { isConnected: isEvmWalletConnected, address: evmAddress } =
    useAccount();
  const {
    handleApprove: _handleApproveEVM,
    handleLock: _handleLockEVM,
    allowance: _allowanceEVM,
    tokenBalance: _tokenBalanceEVM,
    hashLock: _hashLockEVM,
    hashApprove: _hashApproveEVM,
  } = useEvmBridge();
  const { isSuccess: lockIsSuccess, isError: lockIsError } =
    useWaitForTransaction({ hash: _hashLockEVM });

  const { isSuccess: approveIsSuccess, isError: approveIsError } =
    useWaitForTransaction({ hash: _hashApproveEVM });

  const selectedMassaTokenKey: number = parseInt(
    Object.keys(tokens).find(
      (_, idx) => tokens[idx].name.slice(0, -2) === token?.name.slice(0, -2),
    ) || '0',
  );

  const evmToken = token?.evmToken as `0x${string}`;
  const { data: tokenData } = useToken({ address: evmToken });

  const [decimals, setDecimals] = useState<number>(tokenData?.decimals || 18);

  const IS_MASSA_TO_EVM = layout === MASSA_TO_EVM;

  useEffect(() => {
    setError({ amount: '' });
    setDecimals(tokenData?.decimals || 18);
  }, [amount, layout, token?.name, tokenData?.decimals]);

  useEffect(() => {
    setAmount('');
  }, [layout, token?.name]);

  useEffect(() => {
    if (lockIsSuccess) {
      setLoading({ box: 'success', bridge: 'success' });

      handleTimerClosePopUp();
    }
    if (lockIsError) {
      setLoading({ box: 'error', bridge: 'error' });
    }
  }, [lockIsSuccess, lockIsError]);

  useEffect(() => {
    if (approveIsSuccess) {
      setLoading({ bridge: 'loading', approve: 'success' });

      handleBridgeEVM();
    }
    if (approveIsError) {
      setLoading({ box: 'error', approve: 'error', bridge: 'error' });
      toast.error(Intl.t(`index.bridge.error.general`));
    }
  }, [approveIsSuccess, approveIsError]);

  async function getProviderList() {
    const providerList = await providers();
    const massaStationWallet = providerList.find(
      (provider) => provider.name() === MASSA_STATION,
    );
    setStationInstalled(!!massaStationWallet);
  }

  useEffect(() => {
    getAccounts();
    getProviderList();
  }, []);

  useEffect(() => {
    getTokens();
  }, [accounts]);

  function handleToggleLayout() {
    setLayout(IS_MASSA_TO_EVM ? EVM_TO_MASSA : MASSA_TO_EVM);
  }

  function EVMHeader() {
    return (
      <div className="mb-4 flex items-center justify-between">
        <div className="w-1/2">
          <Dropdown
            readOnly={!isEvmWalletConnected || isFetching}
            options={
              chains.length
                ? chains.map((chain) => ({
                    item: chain.name + ' Testnet',
                    icon: iconsNetworks['Sepolia'],
                  }))
                : [
                    {
                      icon: iconsNetworks['Sepolia'],
                      item: 'Sepolia Testnet',
                    },
                  ]
            }
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
    function displayStatus() {
      if (!isStationInstalled) return <NotInstalled />;
      else if (hasNoAccounts) return <NoAccounts />;
      return <Connected />;
    }

    return (
      <div className="mb-4 flex items-center justify-between">
        <div className="w-1/2">
          <Dropdown
            readOnly={hasNoAccounts || isFetching}
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
          {isFetching ? <FetchingStatus /> : displayStatus()}
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
        readOnly={IS_MASSA_TO_EVM || isFetching}
        size="xs"
        options={tokens.map((token) => {
          return {
            item: token.symbol.slice(0, -2),
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
        readOnly={!IS_MASSA_TO_EVM || isFetching}
        size="xs"
        options={tokens.map((token) => {
          return {
            item: token.symbol,
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
        <div className="mas-body">
          {isFetching ? (
            <FetchingLine />
          ) : (
            <TokenBalance amount={_tokenBalanceEVM} />
          )}
        </div>
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
            <TokenBalance amount={token?.balance} />
          )}
        </div>
      </div>
    );
  }

  function TokenBalance({ ...props }: { amount?: bigint }) {
    let { amount } = props;

    let { in2decimals, full } = formatAmount(
      amount ? amount.toString() : '0',
      decimals,
    );

    return (
      <div className="flex items-center">
        {in2decimals} <Tooltip content={full} />
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
          fees: <MassaFees />,
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
          fees: <EVMFees />,
          balance: null,
        },
      },
    };

    return layouts[layout];
  }

  function validate() {
    setError(null);

    if (!amount) {
      setError({ amount: Intl.t('index.approve.error.invalid-amount') });
      return false;
    }

    let _amount;
    let _balance;

    if (IS_MASSA_TO_EVM) {
      if (!token) {
        return false;
      }
      _amount = parseUnits(amount, decimals);
      _balance = token.balance;
    } else {
      if (!_tokenBalanceEVM) {
        return false;
      }
      _amount = parseUnits(amount, decimals);
      _balance = _tokenBalanceEVM;
    }

    if (_amount <= 0n) {
      setError({ amount: Intl.t('index.approve.error.invalid-amount') });
      return false;
    }

    if (_balance < _amount) {
      setError({ amount: Intl.t('index.approve.error.insuficient-funds') });
      return false;
    }

    return true;
  }

  async function handleApproveEVM() {
    try {
      setLoading({ approve: 'loading' });

      if (!amount) {
        return false;
      }

      let _amount = parseUnits(amount, decimals);

      if (_allowanceEVM < _amount) {
        await _handleApproveEVM();
        return false;
      }

      // already approved requested amount
      setLoading({ approve: 'success' });
    } catch (error) {
      console.log(error);
      setLoading({ box: 'error', approve: 'error', bridge: 'error' });

      return false;
    }

    return true;
  }

  async function handleBridgeEVM() {
    setLoading({ bridge: 'loading' });

    try {
      if (!amount) {
        throw new Error('Amount is not defined');
      }
      await _handleLockEVM(parseUnits(amount, decimals));
    } catch (error) {
      console.log(error);
      toast.error(Intl.t(`index.bridge.error.general`));
      setLoading({ box: 'error', bridge: 'error' });

      return false;
    }

    return true;
  }

  async function handleApproveMASSA() {
    setLoading({
      approve: 'loading',
    });
    try {
      if (!account) {
        throw new Error('Account is not defined');
      }
      if (!token) {
        throw new Error('Token is not defined');
      }
      if (!amount) {
        throw new Error('Amount is not defined');
      }

      let _amount = parseUnits(amount, decimals);

      if (token.allowance < _amount) {
        await increaseAllowance(account, token.massaToken, U256_MAX);
      }

      setLoading({
        approve: 'success',
      });
    } catch (error) {
      console.log(error);
      toast.error(Intl.t(`index.approve.error.general`));
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

  async function handleBridgeMASSA() {
    setLoading({
      bridge: 'loading',
    });

    try {
      if (!account) {
        throw new Error('Account is not defined');
      }
      if (!token) {
        throw new Error('Token is not defined');
      }
      if (!evmAddress) {
        throw new Error('Evm account is not defined');
      }
      if (!amount) {
        throw new Error('amount is not defined');
      }

      let tokenPairs = new TokenPair(
        token.massaToken,
        token.evmToken,
        token.chainId,
      );

      await forwardBurn(
        account,
        evmAddress,
        tokenPairs,
        parseUnits(amount, decimals),
      );

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

  function handleClosePopUp() {
    setLoading({
      box: 'none',
      approve: 'none',
      bridge: 'none',
    });
    setAmount('');
  }

  function handleTimerClosePopUp(timer = 10000) {
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
    if (!validate()) return;

    setLoading({
      box: 'loading',
    });

    if (IS_MASSA_TO_EVM) {
      const approved = await handleApproveMASSA();

      if (approved) {
        handleBridgeMASSA();
      }
    } else {
      const approved = await handleApproveEVM();

      if (approved) {
        handleBridgeEVM();
      }
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
          bridgeLoading={loading.bridge} // error, success, loading, none
          massaToEvm={IS_MASSA_TO_EVM}
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
                disable={isFetching}
                name="amount"
                value={amount}
                onValueChange={(value) => setAmount(value)}
                placeholder={Intl.t(`index.input.placeholder.amount`)}
                suffix=""
                decimalsLimit={decimals}
                error={error?.amount}
              />
            </div>
            <div className="w-1/3">{boxLayout(layout).up.token}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {isEvmWalletConnected ? (
                <h3
                  className="mas-h3 text-f-disabled-1 underline cursor-pointer"
                  onClick={() => setOpenTokensModal(true)}
                >
                  {Intl.t(`index.get-tokens`)}
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
            disabled={isFetching}
            variant="toggle"
            onClick={handleToggleLayout}
            customClass={`w-12 h-12 inline-block transition ease-in-out delay-10 ${
              IS_MASSA_TO_EVM ? 'rotate-180' : ''
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
                decimalsLimit={decimals}
                error=""
                disable={true}
              />
            </div>
            <div className="w-1/3">{boxLayout(layout).down.token}</div>
          </div>
          <div className="flex justify-between items-center">
            <br />
            {boxLayout(layout).down.balance}
          </div>
        </div>
        <div>
          <Button
            disabled={
              isFetching || !isStationInstalled || !isEvmWalletConnected
            }
            onClick={(e) => handleSubmit(e)}
          >
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
