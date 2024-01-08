import Intl from '@/i18n/i18n';
import { FetchingStatus } from '@/pages/Index/Layouts/LoadingLayout/FetchingComponent';
import { useAccountStore } from '@/store/store';
import {
  MASSA_STATION_URL,
  MASSA_STATION_INSTALL,
  linkToCreateAccount,
} from '@/utils/const';

interface IErrorObject {
  [key: string]: {
    url: string;
    content: string;
    link?: string;
  };
}

const ErrorObject: IErrorObject = {
  errorMassaStation: {
    url: MASSA_STATION_INSTALL,
    content: Intl.t('connect-wallet.station-connect-error.error-station'),
  },
  errorAccount: {
    url: linkToCreateAccount,
    content: Intl.t('connect-wallet.station-connect-error.error-account'),
    link: Intl.t('connect-wallet.station-connect-error.add-account'),
  },
  errorWallet: {
    url: MASSA_STATION_URL,
    content: Intl.t('connect-wallet.station-connect-error.error-wallet'),
    link: Intl.t('connect-wallet.station-connect-error.add-wallet'),
  },
};

export function MassaConnectError() {
  const [isFetching] = useAccountStore((state) => [state.isFetching]);

  return isFetching ? <FetchingStatus /> : <DisplayError />;
}

function DisplayError() {
  const [accounts, isStationInstalled] = useAccountStore((state) => [
    state.accounts,
    state.isStationInstalled,
  ]);

  const hasNoAccounts = accounts?.length <= 0;
  const errorMessage = !isStationInstalled
    ? 'errorMassaStation'
    : hasNoAccounts
    ? 'errorAccount'
    : 'errorWallet';

  return (
    <div className="max-w-10 mas-body">
      {errorMessage === 'errorMassaStation' ? (
        ErrorObject[errorMessage].content
      ) : (
        <>
          {ErrorObject[errorMessage].content}
          <br />
          <a
            className="mas-menu-underline"
            href={ErrorObject[errorMessage].url}
            target="_blank"
          >
            {ErrorObject[errorMessage].link}
          </a>
        </>
      )}
    </div>
  );
}
