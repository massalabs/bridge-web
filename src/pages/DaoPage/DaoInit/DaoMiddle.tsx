import { ReactElement } from 'react';
import { FetchingLine, MassaLogo, Tag } from '@massalabs/react-ui-kit';
import { MASSA_TOKEN } from '@/const';
import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';
import { maskAddress } from '@/utils/massaFormat';
interface DaoMiddleProps {
  amount: string;
}

export function DaoMiddle(props: DaoMiddleProps) {
  const { amount } = props;
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

  /* We parse to float to convert values such as '001.0000' to '1' */
  const expectedRedeemedMasAmount = amount && parseFloat(amount);

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex justify-between w-full">
        <div>{Intl.t('dao-maker.receive')}</div>
        <div>
          {expectedRedeemedMasAmount} {MASSA_TOKEN}
        </div>
      </div>
      <div className="flex justify-between w-full">
        <div>{Intl.t('history.to')}</div>
        <div>{getConnectedAddress()}</div>
      </div>
      <div className="flex justify-between w-full">
        <div>{Intl.t('general.network')}</div>
        <div className="flex items-center gap-2">
          <MassaLogo size={16} /> <div>{Intl.t('general.Massa')}</div>
        </div>
      </div>
    </div>
  );
}
