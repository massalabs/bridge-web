import {
  Bsc,
  Dropdown,
  FetchingLine,
  Money,
  WMAS,
} from '@massalabs/react-ui-kit';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { wmasDecimals, wmasSymbol } from '..';
import { InputHead } from '@/components/inputAmount/InputHead';
import { Blockchain } from '@/const';
import { ChainContext } from '@/custom/bridge/useNetworkValidation';
import Intl from '@/i18n/i18n';
import { useBridgeModeStore } from '@/store/store';

interface DaoHeadProps {
  amount: string;
  setAmount: (value: string) => void;
  setAmountError: (value: string) => void;
  amountError: string | undefined;
  wmasBalance: bigint;
  fetchingBalance: boolean;
}

export function DaoHead(props: DaoHeadProps) {
  const {
    amount,
    setAmount,
    amountError,
    wmasBalance,
    fetchingBalance,
    setAmountError,
  } = props;
  const { address: evmAddress, isConnected } = useAccount();
  const { currentMode } = useBridgeModeStore();

  function handleAmountChange(o: string) {
    setAmount(o);
    setAmountError('');
  }

  const options = [
    {
      icon: <Bsc size={32} />,
      item: `${Intl.t(`general.${Blockchain.BSC}`)} ${Intl.t(
        `general.${currentMode}`,
      )}`,
    },
  ];

  return (
    <>
      <div className="flex flex-col p-6 gap-6 bg-primary rounded-2xl mb-5">
        <InputHead
          isMassaChain={false}
          address={evmAddress as string}
          context={ChainContext.DAO}
          dropdownOptions={options}
          isConnected={isConnected}
          select={undefined}
        />

        <div className="flex items-center justify-between gap-4">
          <div className="w-full">
            <Money
              name="amount"
              value={amount}
              onValueChange={(o) => handleAmountChange(o.value)}
              placeholder={Intl.t('index.input.placeholder.amount')}
              suffix=""
              decimalScale={wmasDecimals}
              error={amountError}
            />
          </div>
          <div className="w-1/3 mb-4">
            <Dropdown
              readOnly={true}
              size="md"
              options={[{ icon: <WMAS />, item: wmasSymbol }]}
            />
          </div>
        </div>
        <div>
          <div className="w-full flex justify-end items-center gap-2">
            <div>{Intl.t('dao-maker.balance')}</div>
            {!fetchingBalance ? (
              <>
                {formatUnits(wmasBalance, wmasDecimals)} {wmasSymbol}
              </>
            ) : (
              <>
                <FetchingLine />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
