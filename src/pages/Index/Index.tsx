import { useState, useRef, SyntheticEvent, useEffect } from 'react';
import Intl from '@/i18n/i18n';
import {
  Dropdown,
  MassaToken,
  MassaLogo,
  Tag,
  Currency,
  Button,
} from '@massalabs/react-ui-kit';
import { FiRepeat } from 'react-icons/fi';
import { GetTokensPopUpModal } from '@/components';
import { tagTypes } from '@/utils/const';
import { useAccountStore } from '@/store/store';

// Remove those 2 lines and replace by correct icon when backend is ready
import { BsDiamondHalf } from 'react-icons/bs';
import { IAccount, IAccountBalanceResponse } from '@massalabs/wallet-provider';
import { useAccount, useBalance } from 'wagmi';
import { ConnectButton as ConnectEvmButton } from '@rainbow-me/rainbowkit';

const iconsAccounts = {
  MASSASTATION: <MassaLogo />,
  OTHER: <BsDiamondHalf size={32} />,
};

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
  const form = useRef(null);
  const [accounts, tokens, getAccounts, getTokens, setAccount, account] =
    useAccountStore((state) => [
      state.accounts,
      state.tokens,
      state.getAccounts,
      state.getTokens,
      state.setAccount,
      state.account,
    ]);

  const isMassaWalletConnected = !!account;

  // HOOKS
  const { isConnected: isEvmWalletConnected, address: EvmAddress } =
    useAccount();
  const { data: evmBalanceObject } = useBalance({
    address: EvmAddress,
  });
  const evmBalance = evmBalanceObject?.formatted;
  const [openTokensModal, setOpenTokensModal] = useState<boolean>(false);
  const [balance, setBalance] = useState<IAccountBalanceResponse>();

  const selectedAccountKey: number = parseInt(
    Object.keys(accounts).find(
      (_, idx) => accounts[idx].name() === account?.name(),
    ) || '0',
  );

  const [from, setFrom] = useState({
    isConnected: isEvmWalletConnected,
    address: `${EvmAddress}`,
    balance: evmBalance,
    walletType: 'EVM wallet',
  });

  const [to, setTo] = useState({
    isConnected: isMassaWalletConnected,
    address: `${account?.address()}`,
    balance: balance?.candidateBalance,
    walletType: 'MassaWallet',
  });

  useEffect(() => {
    const newMassaData = {
      isConnected: isMassaWalletConnected,
      address: `${account?.address()}`,
      balance: balance?.candidateBalance,
    };
    if (to.walletType === 'MassaWallet') {
      setTo((prev) => ({ ...prev, ...newMassaData }));
    } else {
      setFrom((prev) => ({ ...prev, ...newMassaData }));
    }
  }, [isMassaWalletConnected, account, balance]);

  useEffect(() => {
    const newEvmData = {
      isConnected: isEvmWalletConnected,
      address: `${EvmAddress}`,
      balance: evmBalance,
    };
    if (from.walletType === 'EVM wallet') {
      setFrom((prev) => ({ ...prev, ...newEvmData }));
    } else {
      setTo((prev) => ({ ...prev, ...newEvmData }));
    }
  }, [isEvmWalletConnected, EvmAddress, evmBalance]);

  const switchFromAndTo = () => {
    setFrom(to);
    setTo(from);
  };

  useEffect(() => {
    getAccounts();
  }, []);

  useEffect(() => {
    getTokens();

    let firstAccount = accounts[0];
    setAccount(firstAccount);
  }, [accounts]);

  useEffect(() => {
    fetchBalance(account).then((balance) => setBalance(balance));
  }, [account]);

  // FUNCTIONS
  async function fetchBalance(account: IAccount | null) {
    try {
      return await account?.balance();
    } catch (error) {
      console.error('Error while retrieving balance: ', error);
    }
  }

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();

    // TODO: add validation function

    // TODO: add submit function
  }

  return (
    <>
      <div
        className={`p-10 max-w-2xl w-full border border-tertiary rounded-2xl
        bg-secondary/50 backdrop-blur-lg text-f-primary`}
      >
        <form ref={form} onSubmit={handleSubmit}>
          <div className="p-6 bg-primary rounded-2xl mb-5">
            <p className="mb-4 mas-body">{Intl.t(`index.from`)}</p>
            <div className="mb-4 flex items-center justify-between">
              {from.walletType === 'MassaWallet' ? (
                <MassaAccountSelector
                  accounts={accounts}
                  setAccount={setAccount}
                  selectedAccountKey={selectedAccountKey}
                />
              ) : (
                <EvmAccountSelector />
              )}
              <ConnectedBox
                isConnected={from.isConnected}
                walletType={from.walletType}
              />
            </div>
            <AddressBox address={from.address} isConnected={from.isConnected} />
            <div className="mb-4 flex items-center gap-2">
              <div className="w-full">
                <Currency
                  defaultValue=""
                  name="amount"
                  placeholder={Intl.t(`index.input.placeholder.amount`)}
                  suffix=""
                />
              </div>
              <Dropdown
                size="xs"
                options={[
                  {
                    item: 'WETH',
                    icon: <BsDiamondHalf />,
                  },
                  {
                    item: 'MASSA',
                    icon: <BsDiamondHalf />,
                  },
                ]}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {isEvmWalletConnected ? (
                  <h3
                    className="mas-h3 text-f-disabled-1 underline cursor-pointer"
                    onClick={() => setOpenTokensModal(true)}
                  >
                    Get tokens
                  </h3>
                ) : (
                  <>
                    <p className="mas-body2">Total fees:</p>
                    <p className="mas-body">0,000.00</p>
                  </>
                )}
              </div>
              <BalanceBox balance={from.balance} />
            </div>
          </div>

          <div className="mb-5 flex justify-center items-center">
            <Button
              variant="toggle"
              onClick={switchFromAndTo}
              customClass="w-12 h-12"
            >
              <FiRepeat size={24} />
            </Button>
          </div>
          <div className="mb-5 p-6 bg-primary rounded-2xl">
            <p className="mb-4 mas-body">{Intl.t(`index.to`)}</p>
            <div className="mb-4 flex items-center justify-between">
              {to.walletType === 'MassaWallet' ? (
                <MassaAccountSelector
                  accounts={accounts}
                  setAccount={setAccount}
                  selectedAccountKey={selectedAccountKey}
                />
              ) : (
                <EvmAccountSelector />
              )}
              <ConnectedBox
                isConnected={to.isConnected}
                walletType={to.walletType}
              />
            </div>

            <AddressBox address={to.address} isConnected={to.isConnected} />

            <div className="mb-4 flex items-center gap-2">
              <div className="w-full">
                <Currency
                  readOnly={true}
                  placeholder={Intl.t(`index.input.placeholder.receive`)}
                />
              </div>
              <div className="w-1/3">
                <Dropdown
                  readOnly={true}
                  size="xs"
                  options={tokens.map((token) => {
                    return {
                      item: token.name,
                      icon: iconsTokens['OTHER'],
                    };
                  })}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <FeesBox fees="0,000.00" chain="Massa" />
                <FeesBox fees="0,000.00" chain="EVM" />
              </div>
              <BalanceBox balance={to.balance} />
            </div>
          </div>
          <div>
            <p className="mas-caption mb-4">
              {Intl.t(`index.total.approve`, { amount: '0,000.00' })}
            </p>
            <div className="flex items-center gap-5">
              <Button onClick={() => console.log('approve')}>
                {Intl.t(`index.button.approve`)}
              </Button>
              <Button variant="secondary" onClick={() => console.log('bridge')}>
                {Intl.t(`index.button.bridge`)}
              </Button>
            </div>
          </div>
        </form>
      </div>
      {openTokensModal && (
        <GetTokensPopUpModal setOpenModal={setOpenTokensModal} />
      )}
    </>
  );
}

function AddressBox({
  address,
  isConnected,
}: {
  address?: string;
  isConnected?: boolean;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <p className="mas-body2">Wallet address:</p>
      <p className="mas-caption">{isConnected ? address : 'Not Connected'}</p>
    </div>
  );
}

function BalanceBox({ balance }: { balance?: string }) {
  return (
    <div className="flex items-center gap-2">
      <p className="mas-body2">Balance:</p>
      <p className="mas-body">{balance || 0}</p>
    </div>
  );
}

function FeesBox({ fees, chain }: { fees?: string; chain: string }) {
  return (
    <div className="flex items-center gap-2">
      <p className="mas-body2">Total {chain} fees:</p>
      <p className="mas-body">{fees}</p>
    </div>
  );
}

function ConnectedBox({
  isConnected,
  walletType,
}: {
  isConnected?: boolean;
  walletType: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <p className="mas-body">{walletType}</p>
      {isConnected ? <Connected /> : <Disconnected />}
    </div>
  );
}

function MassaAccountSelector({
  accounts,
  setAccount,
  selectedAccountKey,
}: {
  accounts: IAccount[];
  setAccount: (account: IAccount) => void;
  selectedAccountKey: number;
}) {
  return (
    <Dropdown
      select={selectedAccountKey}
      options={accounts.map((account) => {
        return {
          item: account.name(),
          icon: iconsAccounts['MASSASTATION'],
          onClick: () => setAccount(account),
        };
      })}
    />
  );
}

function EvmAccountSelector() {
  return <ConnectEvmButton />;
}
