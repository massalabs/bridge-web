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
import { FiRepeat } from 'react-icons/fi';
import { GetTokensPopUpModal } from '@/components';
import { tagTypes } from '@/utils/const';
import { useAccountStore } from '@/store/store';
import { BsDiamondHalf } from 'react-icons/bs';
import { IAccount, IAccountBalanceResponse } from '@massalabs/wallet-provider';
import { forwardBurn, increaseAllowance } from '@/custom/bridge/bridge';
import { TokenPair } from '@/custom/serializable/tokenPair';
import { FetchingLine, FetchingStatus, Loading } from './Loading';
import { formatStandard, maskAddress } from '@/utils/massaFormat';
import { useAccount, useBalance } from 'wagmi';
import { ConnectButton as ConnectEvmButton } from '@rainbow-me/rainbowkit';

const BRIDGE = 'bridge';
const APPROVE = 'approve';

const MASSA_TO_EVM = 'massaToEvm';
const EVM_TO_MASSA = 'evmToMassa';

const iconsTokens = {
  MASSASTATION: <MassaLogo size={24} />,
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<{ amount: string } | null>(null);

  const isMassaWalletConnected = !!account;
  const [evmWalletConnected, _] = useState<boolean>(true); // TODO: replace by correct hook when backend is ready
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
    return (
      <div className="mb-4 flex items-center justify-between">
        <ConnectEvmButton />
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
          <p className="mas-body">MassaWallet</p>
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
        options={[
          {
            item: 'tDai',
            icon: <BsDiamondHalf />,
            onClick: () => setToken(token),
          },
          {
            item: 'Sepolia',
            icon: <BsDiamondHalf />,
            onClick: () => setToken(token),
          },
        ]}
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
          <p className="mas-body2">Total Massa fees:</p>
          <p className="mas-body">{formatStandard(Number(0))}</p>
        </div>
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
          <p className="mas-body2">Total EVM fees:</p>
          <p className="mas-body">{formatStandard(Number(0))}</p>
        </div>
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
        <p className="mas-body">{formatStandard(Number(evmBalance))}</p>
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
          balance: <EVMBalance />,
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
          balance: <MassaBalance />,
        },
      },
    };

    return layouts[layout];
  }

  // FUNCTIONS
  function validateApprove() {
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
    if (!validateApprove()) return;

    setLoading(true);
    try {
      const result = await increaseAllowance(
        account ?? undefined,
        token?.massaToken ? token.massaToken : '',
        amount ? Number(amount) : 0,
      );
      console.log(result);
      toast.success(
        Intl.t(`index.approve.success`, {
          from: maskAddress(result.recipient),
        }),
      );
    } catch (error: any) {
      console.log(error);
      if (
        error?.message?.split('message:').pop().trim() !==
        'Unable to unprotect wallet'
      )
        toast.error(Intl.t(`index.approve.error.general`));
    } finally {
      setLoading(false);
    }
  }

  async function handleBridge() {
    setLoading(true);
    try {
      const result = await forwardBurn(account ?? undefined, {
        massaToken: token?.massaToken,
        evmToken: token?.evmToken,
        chainId: token?.chainId,
      } as TokenPair);

      toast.success(
        Intl.t(`index.bridge.success`, {
          from: maskAddress(result.recipient),
        }),
      );
    } catch (error) {
      console.log(error);
      toast.error(Intl.t(`index.bridge.error.general`));
    } finally {
      setLoading(false);
    }
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
    Object.keys(tokens).find((_, idx) => tokens[idx].name === token?.name) ||
      '0',
  );

  function handleSubmit(e: SyntheticEvent, action: string) {
    e.preventDefault();

    if (layout === MASSA_TO_EVM) {
      if (action === APPROVE) {
        handleApprove();
      } else if (action === BRIDGE) {
        handleBridge();
      }
    } else if (layout === EVM_TO_MASSA) {
      // TODO: TO BE IMPLEMENTED
      console.log('TODO: TO BE IMPLEMENTED');
    }
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div
            className={`p-10 max-w-2xl w-full border border-tertiary rounded-2xl
        bg-secondary/50 backdrop-blur-lg text-f-primary`}
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
                    readOnly={true}
                    placeholder={Intl.t(`index.input.placeholder.receive`)}
                    name="receive"
                    value={amount}
                    onValueChange={(value) => setAmount(value)}
                    suffix=""
                    error=""
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
              <div className="flex items-center gap-5">
                <Button onClick={(e) => handleSubmit(e, 'approve')}>
                  {Intl.t(`index.button.approve`)}
                </Button>
                <Button
                  variant="secondary"
                  onClick={(e) => handleSubmit(e, 'bridge')}
                >
                  {Intl.t(`index.button.bridge`)}
                </Button>
              </div>
            </div>
          </div>
          {openTokensModal && (
            <GetTokensPopUpModal setOpenModal={setOpenTokensModal} />
          )}
        </>
      )}
    </>
  );
}
