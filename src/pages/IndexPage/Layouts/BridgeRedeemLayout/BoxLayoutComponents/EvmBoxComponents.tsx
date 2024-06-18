import { mainnet, sepolia, bsc, bscTestnet } from 'viem/chains';
import { useAccount } from 'wagmi';
import { InputHead } from '@/components/inputAmount/InputHead';
import { Blockchain, SupportedEvmBlockchain } from '@/const';
import { ChainContext } from '@/custom/bridge/useNetworkValidation';
import { getEvmNetworkIcon } from '@/custom/useGetEvmIconsAndName';
import Intl from '@/i18n/i18n';

import {
  useBridgeModeStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';

export function EVMHeader() {
  const { isConnected, address } = useAccount();
  const { currentMode, isMainnet: getIsMainnet } = useBridgeModeStore();
  const { setSelectedEvm, setAmounts, selectedEvm, availableEvmNetworks } =
    useOperationStore();

  const { resetSelectedToken } = useTokenStore();
  const isMainnet = getIsMainnet();

  function handleChangeEvmNetwork(selectedEvm: SupportedEvmBlockchain) {
    setAmounts(undefined, undefined);
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
    <InputHead
      address={address as string}
      context={ChainContext.BRIDGE}
      isMassaChain={false}
      isConnected={isConnected}
      dropdownOptions={options}
      select={availableEvmNetworks.indexOf(selectedEvm)}
    />
  );
}
