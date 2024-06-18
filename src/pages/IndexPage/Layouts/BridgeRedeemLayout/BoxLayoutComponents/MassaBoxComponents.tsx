import { MAINNET, BUILDNET } from '@massalabs/massa-web3';
import { massaIconsNetworks } from '../BoxLayout';
import { InputHead } from '@/components/inputAmount/InputHead';
import { ChainContext } from '@/custom/bridge/useNetworkValidation';
import Intl from '@/i18n/i18n';
import { useAccountStore, useBridgeModeStore } from '@/store/store';

export function MassaHeader() {
  const { isFetching, accounts, currentProvider, connectedAccount } =
    useAccountStore();
  const { massaNetwork: getMassaNetwork, isMainnet: getIsMainnet } =
    useBridgeModeStore();
  const massaNetwork = getMassaNetwork();

  const isMainnet = getIsMainnet();
  const hasNoAccounts = !accounts?.length;

  const isConnected =
    (!isFetching && currentProvider && !hasNoAccounts) || false;

  const massaOptions = [
    {
      item: `${Intl.t('general.Massa')} ${Intl.t(`general.${massaNetwork}`)}`,
      icon: isMainnet
        ? massaIconsNetworks[MAINNET]
        : massaIconsNetworks[BUILDNET],
    },
  ];

  return (
    <div className="flex items-center justify-between">
      <InputHead
        address={connectedAccount?.address() || ''}
        dropdownOptions={massaOptions}
        isMassaChain={true}
        context={ChainContext.BRIDGE}
        isConnected={isConnected}
        select={undefined}
      />
    </div>
  );
}
