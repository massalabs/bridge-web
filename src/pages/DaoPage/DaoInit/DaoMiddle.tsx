import { ReactElement } from 'react';
import { MassaLogo, Tag } from '@massalabs/react-ui-kit';
import { wmasDecimals } from '../DaoPage';
import { Blockchain, MASSA_TOKEN } from '@/const';
import Intl from '@/i18n/i18n';
import { FetchingLine } from '@/pages';
import { useAccountStore } from '@/store/store';
import { maskAddress } from '@/utils/massaFormat';
import { formatAmountToDisplay } from '@/utils/parseAmount';
interface DaoMiddleProps {
  amount: string;
}

export function DaoMiddle(props: DaoMiddleProps) {
  const { amount } = props;
  const { amountFormattedFull } = formatAmountToDisplay(amount, wmasDecimals);
  const { connectedAccount } = useAccountStore();
  const massaAddress = connectedAccount?.address();

  function getConnectedAddress(): ReactElement {
    if (!connectedAccount) {
      return <Tag type="error">{Intl.t('dao-maker.wallet-not-connected')}</Tag>;
    } else if (!massaAddress) {
      return <FetchingLine />;
    }
    return <>{maskAddress(massaAddress)}</>;
  }
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex justify-between w-full">
        <div>{Intl.t('dao-maker.receive')}</div>
        <div>
          {amountFormattedFull} {MASSA_TOKEN}
        </div>
      </div>
      <div className="flex justify-between w-full">
        <div>{Intl.t('history.to')}</div>
        <div>{getConnectedAddress()}</div>
      </div>
      <div className="flex justify-between w-full">
        <div>{Intl.t('general.network')}</div>
        <div className="flex items-center gap-2">
          <MassaLogo size={16} /> <div>{Blockchain.MASSA}</div>
        </div>
      </div>
    </div>
  );
}
