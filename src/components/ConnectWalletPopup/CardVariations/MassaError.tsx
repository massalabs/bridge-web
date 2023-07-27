import { FetchingStatus } from '@/pages/Index/Loading';
import { linkToCreateWallet, linkToInstall } from '@/utils/const';

import { useEffect, useState } from 'react';
import Intl from '@/i18n/i18n';

export function MassaConnectError({ ...props }) {
  const { accounts, isFetching, isStationInstalled } = props;

  const [errorMessage, setErrorMessage] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (!isStationInstalled) {
      setErrorMessage(<ErrorMassaStation />);
    } else if (isStationInstalled && accounts?.length <= 0) {
      setErrorMessage(<ErrorWallet />);
    }
  }, [isStationInstalled]);

  return <>{isFetching ? <FetchingStatus /> : errorMessage}</>;
}

export function ErrorMassaStation() {
  return (
    <div className="truncate max-w-10 mas-body">
      <a href={linkToInstall} target="_blank">
        <u>{Intl.t('connect-wallet.station-connect-error.download-station')}</u>
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
