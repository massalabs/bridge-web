import { Tooltip } from '@massalabs/react-ui-kit';

import { ConnectedAccount } from './ConnectedAccount';
import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';

export default function BearbyWallet() {
  const { connectedAccount } = useAccountStore();

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        {connectedAccount ? (
          <div className="flex items-center">
            <div className="mas-body">
              Bearby {Intl.t('connect-wallet.card-destination.to')}
            </div>
            <Tooltip
              customClass="mas-caption w-fit whitespace-nowrap"
              content={Intl.t(
                'connect-wallet.card-destination.non-massa-wallet',
              )}
            />
          </div>
        ) : (
          <div className="mas-body">
            Bearby {Intl.t('connect-wallet.card-destination.not-installed')}
          </div>
        )}
      </div>
      {connectedAccount && <ConnectedAccount />}
    </>
  );
}
