import { Dropdown } from '@massalabs/react-ui-kit';
import { FiAlertCircle } from 'react-icons/fi';
import { useAccount } from 'wagmi';
import { iconsNetworks } from '../BoxLayout';
import { ChainStatus } from '@/components/Status/ChainStatus';
import { Blockchain } from '@/const';
import { useConnectedEvmChain } from '@/custom/bridge/useConnectedEvmChain';
import { useConnectorName } from '@/custom/bridge/useConnectorName';
import Intl from '@/i18n/i18n';
import { useBridgeModeStore } from '@/store/store';

interface ChainOptions {
  icon: JSX.Element | undefined;
  item: string;
}

export function EVMHeader() {
  const { isConnected } = useAccount();
  const { evmNetwork: getEvmNetwork, isMainnet: getIsMainnet } =
    useBridgeModeStore();
  const { chain } = useAccount();

  const evmNetwork = getEvmNetwork();
  const isMainnet = getIsMainnet();

  const chainName = chain?.name || undefined;
  const chainSymbol = chain?.nativeCurrency.symbol || undefined;

  function getCurrentChainInfo(): ChainOptions {
    if (!chainSymbol) {
      return {
        icon: <FiAlertCircle size={32} />,
        item: Intl.t(`general.${Blockchain.INVALID_CHAIN}`),
      };
    } else if (isMainnet) {
      return {
        icon: iconsNetworks[chainSymbol],
        item: `${chainName} ${Intl.t(`general.${evmNetwork}`)}`,
      };
    }
    return {
      icon: iconsNetworks[chainSymbol],
      item: `${chainName} ${Intl.t(`general.${evmNetwork}`)}`,
    };
  }

  const walletName = useConnectorName();
  const currentEvmChain = useConnectedEvmChain();

  return (
    <div className="flex items-center justify-between">
      <div className="w-1/2">
        <Dropdown readOnly={true} options={[getCurrentChainInfo()]} />
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
