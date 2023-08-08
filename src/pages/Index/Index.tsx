import { useState, SyntheticEvent, useEffect, ReactNode } from 'react';

import { Client } from '@massalabs/massa-web3';
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
import currency from 'currency.js';
import { BsDiamondHalf } from 'react-icons/bs';
import { FiRepeat } from 'react-icons/fi';
import { parseUnits, Log as IEventLog } from 'viem';
import {
  useAccount,
  useNetwork,
  useFeeData,
  useWaitForTransaction,
  useToken,
  useSwitchNetwork,
  useContractEvent,
} from 'wagmi';

import { FetchingLine, FetchingStatus, LoadingBox } from './Loading';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import {
  GetTokensPopUpModal,
  Connected,
  Disconnected,
  NoAccounts,
  NotInstalled,
} from '@/components';
import { WrongChain } from '@/components/Status/WrongChain/WrongChain';
import {
  LayoutType,
  ILoadingState,
  MASSA_STATION,
  U256_MAX,
  EVM_BRIDGE_ADDRESS,
} from '@/const';
import {
  forwardBurn,
  getOperationStatus,
  increaseAllowance,
} from '@/custom/bridge/bridge';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
import { TokenPair } from '@/custom/serializable/tokenPair';
import { getFilteredScOutputEvents } from '@/custom/token/token';
import Intl from '@/i18n/i18n';
import { IToken } from '@/store/accountStore';
import { useAccountStore } from '@/store/store';
import { EVM_TO_MASSA, MASSA_TO_EVM } from '@/utils/const';
import { formatStandard } from '@/utils/massaFormat';
import { formatAmount } from '@/utils/parseAmount';
import { isJSON } from '@/utils/utils';

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
    massaClient,
    connectedAccount,
    setToken,
    token,
    isFetching,
    setStationInstalled,
    isStationInstalled,
    startRefetch,
    providersFetched,
    loadAccounts,
  ] = useAccountStore((state) => [
    state.accounts,
    state.tokens,
    state.getAccounts,
    state.getTokens,
    state.massaClient,
    state.connectedAccount,
    state.setToken,
    state.token,
    state.isFetching,
    state.setStationInstalled,
    state.isStationInstalled,
    state.startRefetch,
    state.providersFetched,
    state.loadAccounts,
  ]);

  const [_interval, _setInterval] = useState<NodeJS.Timeout>();
  const [openTokensModal, setOpenTokensModal] = useState<boolean>(false);
  const [amount, setAmount] = useState<string | undefined>('');
  const [layout, setLayout] = useState<LayoutType | undefined>(EVM_TO_MASSA);
  const [error, setError] = useState<{ amount: string } | null>(null);

  const [burnMassaOperation, setBurnMassaOperation] = useState<string>('');
  const [bridgeMassaOperation, setBridgeMassaOperation] = useState<
    string | undefined
  >('');
  const [eventsEVM, setEventsEVM] = useState<IEventLog[]>([]);
  const [redeemSteps, setRedeemSteps] = useState<string>(
    Intl.t('index.loading-box.burn'),
  );

  const [loading, _setLoading] = useState<ILoadingState>({
    box: 'none',
    bridge: 'none',
    approve: 'none',
    burn: 'none',
    redeem: 'none',
    lock: 'none',
    mint: 'none',
  });

  function setLoading(state: ILoadingState) {
    _setLoading((prevState) => {
      return { ...prevState, ...state };
    });
  }

  const hasNoAccounts = accounts?.length <= 0;

  const { chain, chains } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
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
  const {
    data: lockData,
    isSuccess: lockIsSuccess,
    isError: lockIsError,
  } = useWaitForTransaction({ hash: _hashLockEVM });

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

  const unwatch = useContractEvent({
    address: EVM_BRIDGE_ADDRESS,
    abi: bridgeVaultAbi,
    eventName: 'Redeemed',
    listener: (events: IEventLog[]) => setEventsEVM(events),
  });

  const IS_MASSA_TO_EVM = layout === MASSA_TO_EVM;

  const SEPOLIA_CHAIN_ID = chains
    .filter((c: { network: string }) => c.network === 'sepolia')
    .at(0)?.id;

  const IS_EVM_SEPOLIA_CHAIN = chain?.id === SEPOLIA_CHAIN_ID;

  useEffect(() => {
    setError({ amount: '' });
    setDecimals(tokenData?.decimals || 18);
  }, [amount, layout, token?.name, tokenData?.decimals]);

  useEffect(() => {
    if (!IS_EVM_SEPOLIA_CHAIN) {
      toast.error(Intl.t('connect-wallet.connect-metamask.wrong-chain'));
    }
  }, [chain]);

  useEffect(() => {
    setAmount('');
  }, [layout, token?.name]);

  useEffect(() => {
    if (lockIsSuccess) {
      setLoading({ lock: 'success' });
      let data = lockData;
      setBridgeMassaOperation(data?.transactionHash);
    }
    if (lockIsError) {
      setLoading({ box: 'error', lock: 'error', mint: 'error' });
    }
  }, [lockIsSuccess, lockIsError]);

  useEffect(() => {
    if (bridgeMassaOperation) monitorMintMassaEvents();
  }, [bridgeMassaOperation]);

  useEffect(() => {
    if (approveIsSuccess) {
      setLoading({ approve: 'success' });
      handleBridgeEVM();
    }
    if (approveIsError) {
      setLoading({
        box: 'error',
        approve: 'error',
        lock: 'error',
        mint: 'error',
      });
      toast.error(Intl.t(`index.bridge.error.general`));
    }
  }, [approveIsSuccess, approveIsError]);

  useEffect(() => {
    if (burnMassaOperation) monitorBurnMassaEvents(burnMassaOperation);
  }, [burnMassaOperation]);

  useEffect(() => {
    if (eventsEVM.length) {
      let filteredEvent = eventsEVM.some(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (ev) => ev.args.burnOpId === burnMassaOperation,
      );

      if (filteredEvent) {
        setLoading({
          box: 'success',
          redeem: 'success',
        });
        toast.success(Intl.t(`index.bridge.success`));

        unwatch?.();
      }
    }
  }, [eventsEVM]);

  async function getProviderList() {
    const providerList = await providers();
    const massaStationWallet = providerList.some(
      (provider: { name: () => string }) => provider.name() === MASSA_STATION,
    );
    setStationInstalled(!!massaStationWallet);
  }

  useEffect(() => {
    if (providersFetched.length > 0) {
      loadAccounts(providersFetched);

      providersFetched.some((provider: { name: () => string }) => {
        provider.name() === MASSA_STATION && setStationInstalled(true);
      });
    } else {
      setStationInstalled(false);
    }
  }, [providersFetched]);

  useEffect(() => {
    getAccounts();
    getProviderList();
    startRefetch();
  }, []);

  useEffect(() => {
    getTokens();
  }, [connectedAccount]);

  function handleToggleLayout() {
    setLayout(IS_MASSA_TO_EVM ? EVM_TO_MASSA : MASSA_TO_EVM);
  }

  function EVMHeader() {
    return (
      <div className="flex items-center justify-between">
        <div className="w-1/2">
          <Dropdown
            readOnly={
              !isEvmWalletConnected || isFetching || !IS_EVM_SEPOLIA_CHAIN
            }
            options={
              chains.length
                ? chains.map((chain: { name: string }) => ({
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
          <p className="mas-body">Metamask</p>
          {isEvmWalletConnected ? (
            !IS_EVM_SEPOLIA_CHAIN ? (
              <WrongChain />
            ) : (
              <Connected />
            )
          ) : (
            <Disconnected />
          )}
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
      <div>
        {IS_EVM_SEPOLIA_CHAIN ? null : (
          <div
            className="flex justify-end mas-h3 text-f-disabled-1 underline cursor-pointer"
            onClick={() => switchNetwork?.(SEPOLIA_CHAIN_ID)}
          >
            {Intl.t(`connect-wallet.connect-metamask.switch-network`)}
          </div>
        )}
        <div className="mt-4 mb-4 flex items-center gap-2">
          <p className="mas-body2">Wallet address:</p>
          <p className="mas-caption">{evmAddress}</p>
        </div>
      </div>
    );
  }

  function MassaMiddle() {
    return (
      <div className="mb-4 flex items-center gap-2">
        <p className="mas-body2">Wallet address:</p>
        <div className="mas-caption">
          {isFetching ? <FetchingLine /> : connectedAccount?.address()}
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
        options={tokens.map((token: IToken) => {
          return {
            item: token.symbol,
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
        options={tokens.map((token: IToken) => {
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
      <div className="flex items-center gap-2 h-6">
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
      <div className="flex items-center gap-2 h-6">
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

    let symbol = IS_MASSA_TO_EVM ? token?.symbol : token?.symbol.slice(0, -2);

    return (
      <div className="flex items-center">
        {in2decimals}{' '}
        <Tooltip
          customClass="mas-caption w-fit whitespace-nowrap"
          content={full + ' ' + symbol}
        />
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

      setLoading({ approve: 'success' });
    } catch (error) {
      console.log(error);
      setLoading({
        box: 'error',
        approve: 'error',
        lock: 'error',
        mint: 'error',
      });

      return false;
    }

    return true;
  }

  async function handleBridgeEVM() {
    setLoading({ lock: 'loading' });

    try {
      if (!amount) {
        throw new Error('Amount is not defined');
      }
      await _handleLockEVM(parseUnits(amount, decimals));
    } catch (error) {
      console.log(error);
      toast.error(Intl.t(`index.bridge.error.general`));
      setLoading({ box: 'error', lock: 'error', mint: 'error' });

      return false;
    }

    return true;
  }

  async function handleApproveMASSA(client: Client) {
    setLoading({
      approve: 'loading',
    });
    try {
      if (!token) {
        throw new Error('Token is not defined');
      }
      if (!amount) {
        throw new Error('Amount is not defined');
      }

      let _amount = parseUnits(amount, decimals);

      if (token.allowance < _amount) {
        await increaseAllowance(client, token.massaToken, U256_MAX);
      }

      setLoading({
        approve: 'success',
      });
    } catch (error) {
      console.log(error);
      toast.error(Intl.t(`index.approve.error.general`));
      setLoading({
        box: 'error',
        approve: 'error',
        burn: 'error',
        redeem: 'error',
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

  async function handleBridgeMASSA(client: Client) {
    try {
      if (!token) {
        throw new Error('Token is not defined');
      }
      if (!evmAddress) {
        throw new Error('Evm address is not defined');
      }
      if (!amount) {
        throw new Error('amount is not defined');
      }

      let tokenPairs = new TokenPair(
        token.massaToken,
        token.evmToken,
        token.chainId,
      );

      let operationId = await forwardBurn(
        client,
        evmAddress,
        tokenPairs,
        parseUnits(amount, decimals),
      );

      setLoading({
        burn: 'loading',
      });
      setBurnMassaOperation(operationId);
      setRedeemSteps(Intl.t('index.loading-box.awaiting-inclusion'));
    } catch (error) {
      console.log(error);
      setLoading({
        box: 'error',
        burn: 'error',
        redeem: 'error',
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
      burn: 'none',
      redeem: 'none',
      lock: 'none',
      mint: 'none',
      bridge: 'none',
    });
    setAmount('');
  }

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading({
      box: 'loading',
    });

    if (IS_MASSA_TO_EVM) {
      if (!massaClient) {
        return;
      }
      const approved = await handleApproveMASSA(massaClient);

      if (approved) {
        await handleBridgeMASSA(massaClient);
      }
    } else {
      const approved = await handleApproveEVM();

      if (approved) {
        await handleBridgeEVM();
      }
    }
  }

  function handlePercent(percent: number) {
    if (!token?.balance || !_tokenBalanceEVM) return;

    let amount = IS_MASSA_TO_EVM
      ? formatAmount(token?.balance.toString()).full
      : formatAmount(_tokenBalanceEVM.toString()).full;
    let newAmount = (
      currency(amount, { symbol: '', precision: decimals }).value * percent
    ).toString();

    if (percent === 1) {
      newAmount = amount.replace(/,|\([^()]*\)/g, '');
    }
    setAmount(newAmount.toString());
  }

  async function monitorBurnMassaEvents(operationId: string) {
    setLoading({
      burn: 'loading',
    });

    if (massaClient) {
      let i = setInterval(async () => {
        let eventStatus = await getOperationStatus(massaClient, operationId);

        if (eventStatus === 'INCLUDED_PENDING') {
          setRedeemSteps(Intl.t('index.loading-box.included-pending'));
          setLoading({
            burn: 'loading',
          });
        } else if (eventStatus === 'FINAL') {
          setLoading({
            burn: 'success',
            redeem: 'loading',
          });
          setRedeemSteps(Intl.t('index.loading-box.burned-final'));
          clearInterval(i);
        } else if (['INCONSISTENT', 'NOT_FOUND'].includes(eventStatus)) {
          setRedeemSteps(Intl.t('index.loading-box.inconsistent-not-found'));
          setLoading({
            box: 'error',
            burn: 'error',
          });
          clearInterval(i);
        }
      }, 5000);

      _setInterval(i);
    }
  }

  async function monitorMintMassaEvents() {
    setLoading({
      mint: 'loading',
    });

    let fetchInterval = 5; // seconds
    let timeout = 150; // seconds
    let timeElapsed = 0;

    if (massaClient) {
      let i = setInterval(async () => {
        let events = await getFilteredScOutputEvents(massaClient);

        let filteredEvent = events.some(
          (ev) =>
            isJSON(ev.data) &&
            JSON.parse(ev.data).eventName === 'TOKEN_MINTED' &&
            JSON.parse(ev.data).txId === bridgeMassaOperation,
        );

        if (filteredEvent) {
          setLoading({
            box: 'success',
            mint: 'success',
          });
          clearInterval(i);
        }

        if (timeElapsed * fetchInterval >= timeout) {
          setLoading({
            box: 'error',
            mint: 'error',
          });
          clearInterval(i);

          return;
        }

        timeElapsed += 1;
      }, fetchInterval * 1000);

      _setInterval(i);
    }
  }

  const isLoading = loading.box !== 'none' ? 'blur-md' : null;

  return (
    <>
      {isLoading && (
        <LoadingBox
          onClose={handleClosePopUp}
          loading={loading}
          massaToEvm={IS_MASSA_TO_EVM}
          amount={amount ?? '0'}
          redeemSteps={redeemSteps}
          token={token}
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
              <div className="flex flex-row-reverse">
                <ul className="flex flex-row mas-body2">
                  <li
                    onClick={() => handlePercent(0.25)}
                    className="mr-3.5 hover:cursor-pointer"
                  >
                    25%
                  </li>
                  <li
                    onClick={() => handlePercent(0.5)}
                    className="mr-3.5 hover:cursor-pointer"
                  >
                    50%
                  </li>
                  <li
                    onClick={() => handlePercent(0.75)}
                    className="mr-3.5 hover:cursor-pointer"
                  >
                    75%
                  </li>
                  <li
                    onClick={() => handlePercent(1)}
                    className="mr-3.5 hover:cursor-pointer"
                  >
                    Max
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-1/3 mb-4">{boxLayout(layout).up.token}</div>
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
              isFetching ||
              !isStationInstalled ||
              !isEvmWalletConnected ||
              !IS_EVM_SEPOLIA_CHAIN
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
