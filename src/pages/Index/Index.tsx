import { useRef, SyntheticEvent } from 'react';

import {
  Dropdown,
  MassaToken,
  Tag,
  Currency,
  Button,
} from '@massalabs/react-ui-kit';
import { FiRepeat } from 'react-icons/fi';

// Remove those 2 lines and replace by correct icon when backend is ready
import { FiAperture } from 'react-icons/fi';
import { BsDiamondHalf } from 'react-icons/bs';

export function Index() {
  const form = useRef(null);

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();

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
          <p className="mb-4 mas-body">From</p>
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
              <Tag type={'error'} content={'Not connected'} />
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
                placeholder="Amount"
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
            onClick={() => console.log('burn')}
            customClass="w-12 h-12"
          >
            <FiRepeat size={24} />
          </Button>
        </div>
        <div className="mb-5 p-6 bg-primary rounded-2xl">
          <p className="mb-4 mas-body">To</p>
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
              <Tag type={'error'} content={'Not connected'} />
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
              <Currency readOnly={true} placeholder="To receive" />
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
          <p className="mas-caption mb-4">Total approved: 0,000.00</p>
          <div className="flex items-center gap-5">
            <Button onClick={() => console.log('approve')}>Approve</Button>
            <Button variant="secondary" onClick={() => console.log('bridge')}>
              Bridge
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
