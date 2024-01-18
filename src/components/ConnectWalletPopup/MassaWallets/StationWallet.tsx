import { ConnectedAccount } from './ConnectedAccount';
import { StationSelectAccount } from './StationSelectAccount';
import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';

export default function StationWallet() {
  const { accounts } = useAccountStore();

  return (
    <div className="flex flex-col gap-4">
      <div className="mas-body">
        {accounts.length ? (
          <div className="flex flex-col space-y-4 ">
            <StationSelectAccount />
            <ConnectedAccount />
          </div>
        ) : (
          <div className="flex flex-col space-y-4 ">
            MassaStation{' '}
            {Intl.t('connect-wallet.card-destination.not-detected')}
            <a
              href="https://docs.massa.net/docs/massaStation/massa-wallet/getting-started"
              target="_blank"
              rel="noreferrer"
              className="text-f-primary underline"
            >
              {Intl.t('connect-wallet.create-wallet')}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
