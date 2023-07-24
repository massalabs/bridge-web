import { MASSA_STATION } from '@/const';
import { FetchingStatus } from '@/pages/Index/Loading';
import { linkToCreateWallet, linkToInstall } from '@/utils/const';
import { providers } from '@massalabs/wallet-provider';
import { useEffect, useState } from 'react';
import Intl from '@/i18n/i18n';

export function MassaConnectError({ ...props }) {
  const { accounts, isFetching } = props;
  const [isMassaStationConnected, setIsMassaStationConnected] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<JSX.Element | null>(null);

  async function getSomething() {
    const providerList = await providers();
    const massaStationWallet = providerList.find(
      (provider: any) => provider.name() === MASSA_STATION,
    );
    setIsMassaStationConnected(!!massaStationWallet);
    if (!isMassaStationConnected) {
      setIsMassaStationConnected(!!massaStationWallet);
      setErrorMessage(<ErrorMassaStation />);
    } else if (isMassaStationConnected && accounts?.length <= 0) {
      setErrorMessage(<ErrorWallet />);
    }
  }

  useEffect(() => {
    getSomething();
  }, [isMassaStationConnected]);

  return <>{errorMessage === null ? <FetchingStatus /> : errorMessage}</>;
}

export function ErrorMassaStation() {
  return (
    <div className="truncate max-w-10 mas-body">
      <a href={linkToInstall} target="_blank">
        <u>
          {' '}
          {Intl.t('connect-wallet.station-connect-error.download-station')}
        </u>
      </a>
      {Intl.t('connect-wallet.station-connect-error.error-station')}
    </div>
  );
}

export function ErrorWallet() {
  return (
    <div className="truncate max-w-10 mas-body">
      {Intl.t('connect-wallet.station-connect-error.error-wallet')}
      <a href={linkToCreateWallet} target="_blank">
        <u>{Intl.t('connect-wallet.station-connect-error.add-wallet')}</u>.
      </a>
    </div>
  );
}
