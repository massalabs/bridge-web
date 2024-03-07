import { useEffect, useState } from 'react';
import { Button } from '@massalabs/react-ui-kit';
import {
  isMassaStationAvailable,
  isMassaWalletEnabled,
} from '@massalabs/wallet-provider';
import { MASSA_STATION_URL } from '@massalabs/wallet-provider/dist/esm/massaStation/MassaStationProvider';
import { ConnectedAccount } from './ConnectedAccount';
import { MASBalance } from './MASBalance';
import { StationSelectAccount } from './StationSelectAccount';
import { WalletError } from './WalletError';
import { useMassaNetworkValidation } from '@/custom/bridge/useWrongNetwork';
import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';
import {
  MASSA_STATION_INSTALL,
  MASSA_STATION_STORE,
  MASSA_WALLET_CREATE_ACCOUNT,
} from '@/utils/const';

export default function StationWallet() {
  const { accounts } = useAccountStore();

  const [stationIsOn, setStationIsOn] = useState<boolean | undefined>(
    undefined,
  );
  const [massaWalletIsOn, setMassaWalletIsOn] = useState<boolean | undefined>(
    undefined,
  );

  useEffect(() => {
    isMassaStationAvailable().then((result) => {
      setStationIsOn(result);
    });
    isMassaWalletEnabled().then((result) => {
      setMassaWalletIsOn(result);
    });
  });

  const { isValidMassaNetwork } = useMassaNetworkValidation();

  if (stationIsOn === false) {
    return (
      <WalletError
        description={Intl.t(
          'connect-wallet.card-destination.massa-station-not-detected',
        )}
        link={MASSA_STATION_INSTALL}
        linkLabel={Intl.t('connect-wallet.card-destination.get-massa-station')}
      />
    );
  }

  if (massaWalletIsOn === false) {
    return (
      <WalletError
        description={Intl.t(
          'connect-wallet.card-destination.massa-wallet-not-detected',
        )}
        link={MASSA_STATION_STORE}
        linkLabel={Intl.t('connect-wallet.card-destination.get-massa-wallet')}
      />
    );
  }

  if (!isValidMassaNetwork) {
    return (
      <Button
        variant="secondary"
        customClass="h-14"
        onClick={() => window.open(MASSA_STATION_URL)}
      >
        {Intl.t('connect-wallet.connect-metamask.switch-network')}
      </Button>
    );
  }

  if (accounts !== undefined && !accounts.length) {
    return (
      <WalletError
        description={Intl.t(
          'connect-wallet.card-destination.massa-wallet-no-account',
        )}
        link={MASSA_WALLET_CREATE_ACCOUNT}
        linkLabel={Intl.t(
          'connect-wallet.card-destination.massa-wallet-create-account',
        )}
      />
    );
  }

  if (accounts === undefined) {
    return <div className="h-14 bg-secondary rounded-lg animate-pulse"></div>;
  }

  return (
    <div className="flex flex-col gap-4 mas-body">
      <div className="flex gap-4">
        <div className="w-1/2">
          <StationSelectAccount />
        </div>
        <div className="w-1/2">
          <ConnectedAccount maskLength={5} />
        </div>
      </div>
      <MASBalance />
    </div>
  );
}
