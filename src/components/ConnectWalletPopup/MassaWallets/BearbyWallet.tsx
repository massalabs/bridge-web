import { Tooltip } from '@massalabs/react-ui-kit';

import { ConnectedAccount } from './ConnectedAccount';
import { WalletError } from './WalletError';
import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';
import { BEARBY_INSTALL } from '@/utils/const';

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
          <WalletError
            description={Intl.t(
              'connect-wallet.card-destination.bearby-not-installed',
            )}
            link={BEARBY_INSTALL}
            linkLabel={Intl.t('connect-wallet.card-destination.get-bearby')}
          />
        )}
      </div>
      {connectedAccount && <ConnectedAccount />}
    </>
  );
}
