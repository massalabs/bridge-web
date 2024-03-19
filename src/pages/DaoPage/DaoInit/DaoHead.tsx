import { ReactElement } from 'react';
import { Dropdown, Money } from '@massalabs/react-ui-kit';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { wmasDecimals, wmasSymbol } from '..';
import { BNBSvg } from '@/assets/BNBSvg';
import { WMasSvg } from '@/assets/WMasSvg';
import { Connected, Disconnected, WrongChain } from '@/components';
import { Blockchain } from '@/const';
import { useBnbNetworkCheck } from '@/custom/bridge/useBnbNetworkCheck';
import Intl from '@/i18n/i18n';
import { FetchingLine } from '@/pages';
import { useBridgeModeStore } from '@/store/store';
import { maskAddress } from '@/utils/massaFormat';

interface DaoHeadProps {
  amount: string;
  setAmount: (value: string) => void;
  amountError: string | undefined;
  wmasBalance: bigint;
  fetchingBalance: boolean;
}

export function DaoHead(props: DaoHeadProps) {
  const { amount, setAmount, amountError, wmasBalance, fetchingBalance } =
    props;
  const { address: evmAddress, isConnected } = useAccount();
  const { isMainnet: getIsMainnet } = useBridgeModeStore();

  const isMainnet = getIsMainnet();

  const isBnbNetworkValid = useBnbNetworkCheck();

  function getChainStatus(): ReactElement {
    if (!isConnected) {
      return <Disconnected />;
    }
    if (isBnbNetworkValid) {
      return <Connected />;
    }
    return <WrongChain blockchain={Blockchain.BSC} />;
  }

  return (
    <>
      <div className="flex flex-col p-6 gap-6 bg-primary rounded-2xl mb-5">
        <div className="flex justify-between">
          <div className="mas-body2">
            <div className="mas-menu-active">{Intl.t('dao-maker.from')}</div>
            <br />
            <div className="flex items-center gap-2">
              {evmAddress ? (
                maskAddress(evmAddress as string)
              ) : (
                <div>Address not found</div>
              )}
              {getChainStatus()}
            </div>
          </div>
          <div className="w-1/2">
            <Dropdown
              readOnly={true}
              options={[
                {
                  icon: <BNBSvg />,
                  item: isMainnet ? Blockchain.BSC : Blockchain.TBSC,
                },
              ]}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="w-full">
            <Money
              name="amount"
              value={amount}
              onValueChange={(o) => setAmount(o.value)}
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
              options={[{ icon: <WMasSvg />, item: wmasSymbol }]}
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
