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
import { registerEvent } from '@/custom/provider/provider';

// Remove those 2 lines and replace by correct icon when backend is ready
import { FiAperture } from 'react-icons/fi';
import { BsDiamondHalf } from 'react-icons/bs';
import { IAccount, IAccountBalanceResponse } from '@massalabs/wallet-provider';

const iconsAccounts = {
  MASSASTATION: <MassaLogo />,
  OTHER: <BsDiamondHalf size={32} />,
};

const iconsTokens = {
  MASSASTATION: <MassaLogo size={24} />,
  OTHER: <BsDiamondHalf />,
};

export function Index() {
  // we must to initialize the providers to be able to use providers()
  // from '@massalabs/wallet-provider';
  registerEvent();

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

  // HOOKS
  const [evmWalletConnected, _] = useState<boolean>(true); // TODO: replace by correct hook when backend is ready
  const [openTokensModal, setOpenTokensModal] = useState<boolean>(false);
  const [balance, setBalance] = useState<IAccountBalanceResponse>();

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

  const selectedAccountKey: number = parseInt(
    Object.keys(accounts).find(
      (_, idx) => accounts[idx].name() === account?.name(),
    ) || '0',
  );

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
              <Dropdown
                options={[
                  {
                    item: 'Sepolia Testnet',
                    icon: <FiAperture size={40} />,
                  },
                  {
                    item: 'Massa Buildnet',
                    icon: <MassaToken />,
                  },
                ]}
              />
              <div className="flex items-center gap-3">
                <p className="mas-body">EVM wallet</p>
                <Tag
                  type={tagTypes.error}
                  content={Intl.t(`index.tag.not-connected`)}
                />
              </div>
            </div>
            <div className="mb-4 flex items-center gap-2">
              <p className="mas-body2">Wallet address:</p>
              <p className="mas-caption">
                0x2b4d87eff06f22798c30dc4407c7d83429aaa9abc
              </p>
            </div>
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
                    <p className="mas-body">0,000.00</p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="mas-body2">Balance:</p>
                <p className="mas-body">0,000.00</p>
              </div>
            </div>
          </div>
          <div className="mb-5 flex justify-center items-center">
            <Button
              variant="toggle"
              onClick={() => console.log('burn')}
              customClass="w-12 h-12"
            >
              <FiRepeat size={24} />
            </Button>
          </div>
          <div className="mb-5 p-6 bg-primary rounded-2xl">
            <p className="mb-4 mas-body">{Intl.t(`index.to`)}</p>
            <div className="mb-4 flex items-center justify-between">
              <div className="w-1/2">
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
              </div>
              <div className="flex items-center gap-3">
                <p className="mas-body">MassaWallet</p>
                <Tag
                  type={tagTypes.error}
                  content={Intl.t(`index.tag.not-connected`)}
                />
              </div>
            </div>
            <div className="mb-4 flex items-center gap-2">
              <p className="mas-body2">Wallet address:</p>
              <p className="mas-caption">{account?.address()}</p>
            </div>
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
                <div className="flex items-center gap-2">
                  <p className="mas-body2">Total EVM fees:</p>
                  <p className="mas-body">0,000.00</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="mas-body2">Total Massa fees:</p>
                  <p className="mas-body">0,000.00</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="mas-body2">Balance:</p>
                <p className="mas-body">{balance?.candidateBalance}</p>
              </div>
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
