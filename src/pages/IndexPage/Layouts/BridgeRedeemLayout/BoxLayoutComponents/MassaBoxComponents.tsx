import { MAINNET, BUILDNET } from '@massalabs/massa-web3';
import { Dropdown, FetchingLine } from '@massalabs/react-ui-kit';
import { massaIconsNetworks } from '../BoxLayout';
import { UpdateMassaWalletWarning } from '@/components/ConnectWalletPopup/MassaWallets/UpdateMassaWalletWarning';
import { ChainStatus } from '@/components/Status/ChainStatus';
import { ChainContext } from '@/custom/bridge/useNetworkValidation';
import Intl from '@/i18n/i18n';
import { useAccountStore, useBridgeModeStore } from '@/store/store';

export function MassaHeader() {
  const { isFetching, accounts, currentProvider } = useAccountStore();
  const { massaNetwork: getMassaNetwork, isMainnet: getIsMainnet } =
    useBridgeModeStore();
  const massaNetwork = getMassaNetwork();

  const isMainnet = getIsMainnet();
  const hasNoAccounts = !accounts?.length;

  const isConnected = !isFetching && currentProvider && !hasNoAccounts;

  return (
    <div className="flex items-center justify-between">
      <div className="w-1/2 flex items-center">
        <UpdateMassaWalletWarning customClass="mr-3" />
        <Dropdown
          readOnly={true}
          options={[
            {
              item: `${Intl.t('general.Massa')} ${Intl.t(
                `general.${massaNetwork}`,
              )}`,
              icon: isMainnet
                ? massaIconsNetworks[MAINNET]
                : massaIconsNetworks[BUILDNET],
            },
          ]}
        />
      </div>
      <div className="flex items-center gap-3">
        <p className="mas-body">
          {isConnected
            ? Intl.t(`connect-wallet.${currentProvider.name()}`)
            : Intl.t('connect-wallet.card-destination.to')}
        </p>
        <ChainStatus context={ChainContext.BRIDGE} isMassaChain={true} />
      </div>
    </div>
  );
}

export function MassaMiddle() {
  const { isFetching, connectedAccount } = useAccountStore();

  return (
    <div className="mt-4 mb-4 flex items-center gap-2">
      <p className="mas-body2">{Intl.t('index.box-layout.wallet-address')}</p>
      <div className="mas-caption">
        {isFetching ? <FetchingLine /> : connectedAccount?.address()}
      </div>
    </div>
  );
}
