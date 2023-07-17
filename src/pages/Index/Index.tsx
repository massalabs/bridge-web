import { Dropdown, MassaToken, Tag, Currency } from '@massalabs/react-ui-kit';

// Remove those 2 lines and replace by correct icon when backend is ready
import { FiAperture } from 'react-icons/fi';
import { BsDiamondHalf } from 'react-icons/bs';

export function Index() {
  return (
    <div
      className={`p-10 max-w-2xl w-full border border-tertiary rounded-2xl
      bg-secondary/50 backdrop-blur-lg text-f-primary`}
    >
      <div className="p-6 bg-primary rounded-2xl">
        <p className="mb-4 mas-body">From</p>
        <div className="mb-4 flex items-center justify-between">
          <Dropdown
            options={[
              {
                item: 'Sepolia Tesnet',
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
          <div className="w-full">
            <Currency placeholder="Amount" />
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
        <div className="flex justify-end items-center gap-2">
          <p className="mas-body2">Balance:</p>
          <p className="mas-body">0,000.00</p>
        </div>
      </div>
    </div>
  );
}
