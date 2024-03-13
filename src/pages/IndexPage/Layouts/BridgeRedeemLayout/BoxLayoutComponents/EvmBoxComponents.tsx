import { Dropdown } from '@massalabs/react-ui-kit';
import { useAccount } from 'wagmi';
import { iconsNetworks } from '../BoxLayout';
import { ChainStatus } from '@/components/Status/ChainStatus';
import { Blockchain } from '@/const';
import { useConnectedEvmChain } from '@/custom/bridge/useConnectedEvmChain';
import { useConnectorName } from '@/custom/bridge/useConnectorName';
import Intl from '@/i18n/i18n';
import { useBridgeModeStore } from '@/store/store';

export function EVMHeader() {
  const { isConnected } = useAccount();
  const { evmNetwork: getEvmNetwork, isMainnet: getIsMainnet } =
    useBridgeModeStore();

  const evmNetwork = getEvmNetwork();
  const isMainnet = getIsMainnet();

  const ethChainAndNetwork = `${Intl.t(
    `general.${Blockchain.ETHEREUM}`,
  )} ${Intl.t(`general.${evmNetwork}`)}`;
  const sepChainAndNetwork = `${Intl.t(`general.Sepolia`)} ${Intl.t(
    `general.${evmNetwork}`,
  )}`;

  const defaultIcon = isMainnet ? iconsNetworks['ETH'] : iconsNetworks['SEP'];
  const defaultNetwork = isMainnet ? ethChainAndNetwork : sepChainAndNetwork;

  const walletName = useConnectorName();
  const currentEvmChain = useConnectedEvmChain();

  return (
    <div className="flex items-center justify-between">
      <div className="w-1/2">
        <Dropdown
          readOnly={true}
          options={[
            {
              icon: defaultIcon,
              item: defaultNetwork,
            },
          ]}
        />
      </div>
      <div className="flex items-center gap-3">
        <p className="mas-body">
          {isConnected
            ? walletName
            : Intl.t('connect-wallet.card-destination.from')}
        </p>
        <ChainStatus blockchain={currentEvmChain} />
      </div>
    </div>
  );
}

export function EVMMiddle() {
  const { address } = useAccount();

  return (
    <div className="mt-4 mb-4 flex items-center gap-2">
      <p className="mas-body2">{Intl.t('index.box-layout.wallet-address')}</p>
      <p className="mas-caption">{address}</p>
    </div>
  );
}
