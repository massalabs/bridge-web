// ConnectMassaWallet.tsx

import { MassaConnectError } from './CardVariations/MassaError';
import {
  Connected,
  MassaConnect,
  Disconnected,
  NoAccounts,
} from '@/components';
import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';

const ConnectMassaWallet = () => {
  const [accounts, isStationInstalled] = useAccountStore((state) => [
    state.accounts,
    state.isStationInstalled,
  ]);
  const hasAccount = accounts?.length > 0;

  const isMassaReady = isStationInstalled && hasAccount;

  function displayStatus() {
    if (!isStationInstalled) return <Disconnected />;
    else if (!hasAccount) return <NoAccounts />;
    return <Connected />;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="mas-body">
          {Intl.t('connect-wallet.card-destination.to')}
        </p>
        {displayStatus()}
      </div>
      {isMassaReady ? <MassaConnect /> : <MassaConnectError />}
    </>
  );
};

export default ConnectMassaWallet;
