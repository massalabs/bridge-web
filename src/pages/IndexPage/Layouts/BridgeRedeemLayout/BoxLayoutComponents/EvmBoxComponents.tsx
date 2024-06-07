import { Dropdown } from '@massalabs/react-ui-kit';
import { mainnet, sepolia, bsc, bscTestnet } from 'viem/chains';
import { useAccount } from 'wagmi';
import { ChainStatus } from '@/components/Status/ChainStatus';
import { Blockchain, SupportedEvmBlockchain } from '@/const';
import { useConnectorName } from '@/custom/bridge/useConnectorName';
import { ChainContext } from '@/custom/bridge/useNetworkValidation';
import Intl from '@/i18n/i18n';
import { getEvmNetworkIcon } from '@/pages';
import {
  useBridgeModeStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';

export function EVMHeader() {
  const { isConnected } = useAccount();
  const { currentMode, isMainnet: getIsMainnet } = useBridgeModeStore();
  const {
    selectedEvm,
    setSelectedEvm,
    availableEvmNetworks,
    setInputAmount,
    setOutputAmount,
  } = useOperationStore();
  const { resetSelectedToken } = useTokenStore();
  const walletName = useConnectorName();
  const currentEvmChain = useConnectedEvmChain();
  const isMainnet = getIsMainnet();

  function handleChangeEvmNetwork(selectedEvm: SupportedEvmBlockchain) {
    setInputAmount('');
    setOutputAmount('');
    setSelectedEvm(selectedEvm);
    resetSelectedToken();
  }

  const options = [
    {
      icon: isMainnet
        ? getEvmNetworkIcon(mainnet.id, 32)
        : getEvmNetworkIcon(sepolia.id, 32),
      item: `${Intl.t(
        `general.${isMainnet ? 'Ethereum' : 'Sepolia'}`,
      )} ${Intl.t(`general.${currentMode}`)}`,
      onClick: () => handleChangeEvmNetwork(SupportedEvmBlockchain.ETH),
    },
    {
      icon: isMainnet
        ? getEvmNetworkIcon(bsc.id, 32)
        : getEvmNetworkIcon(bscTestnet.id, 32),
      item: `${Intl.t(`general.${Blockchain.BSC}`)} ${Intl.t(
        `general.${currentMode}`,
      )}`,
      onClick: () => handleChangeEvmNetwork(SupportedEvmBlockchain.BSC),
    },
  ];
  return (
    <div className="flex items-center justify-between">
      <div className="w-1/2">
        <Dropdown
          options={options}
          select={availableEvmNetworks.indexOf(selectedEvm)}
        />
      </div>
      <div className="flex items-center gap-3">
        <p className="mas-body">
          {isConnected
            ? walletName
            : Intl.t('connect-wallet.card-destination.from')}
        </p>
        <ChainStatus context={ChainContext.BRIDGE} isMassaChain={false} />
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
