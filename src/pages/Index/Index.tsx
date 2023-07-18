import { useRef, SyntheticEvent, useEffect } from 'react';
import Intl from '@/i18n/i18n';

import {
  IAccount,
  IAccountBalanceResponse,
  IProvider,
  providers,
} from '@massalabs/wallet-provider';

import {registerEvent} from '../../custom/provider/provider';

import {
  Dropdown,
  MassaToken,
  Tag,
  Currency,
  Button,
} from '@massalabs/react-ui-kit';
import { FiRepeat } from 'react-icons/fi';
import { useAccountStore } from '@/store/store';

// Remove those 2 lines and replace by correct icon when backend is ready
import { FiAperture } from 'react-icons/fi';
import { BsDiamondHalf } from 'react-icons/bs';

export function Index() {

  // we must to initialize the providers to be able to use providers()
  // from '@massalabs/wallet-provider';
  registerEvent();

  const form = useRef(null);
  const getAvailableAccounts = useAccountStore((state) => state.getAvailableAccounts);
  const availableAccounts = useAccountStore((state) => state.availableAccounts);

  
  function buildOptions(items: []) {
    let optionsList = [];

    items?.map((item: string) => {
      optionsList.push({
        item: item._name,
        icon: <MassaToken />,
      });
    });

    return optionsList;
  }


  useEffect(() => {
    getAvailableAccounts();
    
  }, [availableAccounts]);


  
  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    
    console.log('handleSubmit');
    
    // TODO: add validation function

    // TODO: add submit function
  }

  return (
    <div
      className={`p-10 max-w-2xl w-full border border-tertiary rounded-2xl
      bg-secondary/50 backdrop-blur-lg text-f-primary`}
    >
      <form ref={form} onSubmit={handleSubmit}>
        <div className="p-6 bg-primary rounded-2xl mb-5">
          <p className="mb-4 mas-body">{Intl.t(`index.from`)}</p>
          <div className="mb-4 flex items-center justify-between">
            <div className="w-1/2">
              <Dropdown options={buildOptions(availableAccounts)}/>
            </div>
            <div className="flex items-center gap-3">
              <p className="mas-body">EVM wallet</p>
              <Tag type={'error'} content={Intl.t(`index.tag.not-connected`)} />
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
              <p className="mas-body2">Total fees:</p>
              <p className="mas-body">0,000.00</p>
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
            onClick={handleSubmit}
            customClass="w-12 h-12"
          >
            <FiRepeat size={24} />
          </Button>
        </div>
        <div className="mb-5 p-6 bg-primary rounded-2xl">
          <p className="mb-4 mas-body">{Intl.t(`index.to`)}</p>
          <div className="mb-4 flex items-center justify-between">
            <Dropdown
              options={[
                {
                  item: 'Massa Buildnet',
                  icon: <MassaToken />,
                },
                {
                  item: 'Sepolia Tesnet',
                  icon: <FiAperture size={40} />,
                },
              ]}
            />
            <div className="flex items-center gap-3">
              <p className="mas-body">MassaWallet</p>
              <Tag type={'error'} content={Intl.t(`index.tag.not-connected`)} />
            </div>
          </div>
          <div className="mb-4 flex items-center gap-2">
            <p className="mas-body2">Wallet address:</p>
            <p className="mas-caption">
              AU12irbDfYNwyZRbnpBrfCBPCxrktp8f8riK2sQddWbzQ3g43G7bb
            </p>
          </div>
          <div className="mb-4 flex items-center gap-2">
            <div className="w-full">
              <Currency
                readOnly={true}
                placeholder={Intl.t(`index.input.placeholder.receive`)}
              />
            </div>
            <Dropdown
              readOnly={true}
              size="xs"
              options={[
                {
                  item: 'mWETH',
                  icon: <BsDiamondHalf />,
                },
              ]}
            />
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
              <p className="mas-body">0,000.00</p>
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
  );
}
