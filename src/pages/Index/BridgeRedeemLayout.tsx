import { Button, Money } from '@massalabs/react-ui-kit';
import { FiRepeat } from 'react-icons/fi';

import { boxLayout } from './boxLayout/boxLayout';
import { LayoutType } from '@/const';
import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';

interface BridgeRedeemInterface {
  isBlurred: string;
  isEvmWalletConnected: boolean;
  IS_MASSA_TO_EVM: boolean;
  isStationInstalled: boolean;
  IS_EVM_SEPOLIA_CHAIN: boolean;
  IS_NOT_BUILDNET: boolean;
  BRIDGE_OFF: boolean;
  REDEEM_OFF: boolean;
  isFetching: boolean;
  layout: LayoutType | undefined;
  amount: string | undefined;
  error: any;
  setAmount: (amount: string) => void;
  decimals: number;
  handlePercent: (number: number) => void;
  handleSubmit: (e: any) => void;
  handleToggleLayout: () => void;
  setOpenTokensModal: (isOpen: boolean) => void;
}

export function BridgeRedeemLayout({ ...args }: BridgeRedeemInterface) {
  const {
    isBlurred,
    IS_MASSA_TO_EVM,
    IS_EVM_SEPOLIA_CHAIN,
    IS_NOT_BUILDNET,
    BRIDGE_OFF,
    REDEEM_OFF,
    layout,
    amount,
    setAmount,
    decimals,
    handlePercent,
    handleSubmit,
    handleToggleLayout,
    setOpenTokensModal,
    error,
    isEvmWalletConnected,
  } = args;

  const [isFetching, isStationInstalled] = useAccountStore((state) => [
    state.isFetching,
    state.isStationInstalled,
  ]);

  return (
    <div
      className={`p-10 max-w-2xl w-full border border-tertiary rounded-2xl
            bg-secondary/50 backdrop-blur-lg text-f-primary mb-5 ${isBlurred}`}
    >
      <div className="p-6 bg-primary rounded-2xl mb-5">
        <p className="mb-4 mas-body">{Intl.t(`index.from`)}</p>
        {boxLayout(layout).up.header}
        {boxLayout(layout).up.wallet}
        <div className="mb-4 flex items-center gap-2">
          <div className="w-full">
            <Money
              disable={isFetching}
              name="amount"
              value={amount}
              onValueChange={(o) => setAmount(o.value)}
              placeholder={Intl.t(`index.input.placeholder.amount`)}
              suffix=""
              decimalScale={decimals}
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
            {isEvmWalletConnected && (
              <h3
                className="mas-h3 text-f-disabled-1 underline cursor-pointer"
                onClick={() => setOpenTokensModal(true)}
              >
                {Intl.t(`index.get-tokens`)}
              </h3>
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
            <Money
              placeholder={Intl.t(`index.input.placeholder.receive`)}
              name="receive"
              value={amount}
              onValueChange={(o) => setAmount(o.value)}
              suffix=""
              decimalScale={decimals}
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
            !IS_EVM_SEPOLIA_CHAIN ||
            IS_NOT_BUILDNET ||
            (BRIDGE_OFF && !IS_MASSA_TO_EVM) ||
            (REDEEM_OFF && IS_MASSA_TO_EVM)
          }
          onClick={(e) => handleSubmit(e)}
        >
          {IS_MASSA_TO_EVM
            ? Intl.t(`index.button.redeem`)
            : Intl.t(`index.button.bridge`)}
        </Button>
      </div>
    </div>
  );
}
