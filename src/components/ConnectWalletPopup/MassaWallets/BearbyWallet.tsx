import { Tooltip } from '@massalabs/react-ui-kit';

import { ConnectedAccount } from './ConnectedAccount';
import { SUPPORTED_MASSA_WALLETS } from '@/const';
import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';

export default function BearbyWallet() {
  const { connectedAccount, providers } = useAccountStore();
  const isProviderAvailable = providers.find(
    (provider) => provider.name() === SUPPORTED_MASSA_WALLETS.BEARBY,
  );

  if (!isProviderAvailable) {
    // TODO: Put the right Error message
    return <div>No provider found ERROR</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="mas-body">
            Bearby {Intl.t('connect-wallet.card-destination.to')}
          </div>
          <Tooltip
            customClass="mas-caption w-fit whitespace-nowrap"
            content={Intl.t('connect-wallet.card-destination.non-massa-wallet')}
          />
        </div>
      </div>
      {connectedAccount && <ConnectedAccount />}
    </>
  );
}
