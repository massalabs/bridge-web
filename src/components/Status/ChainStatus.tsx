import { useAccount } from 'wagmi';
import { Connected, Disconnected, WrongChain } from '.';
import { Blockchain } from '@/const';

import { useMassaNetworkValidation } from '@/custom/bridge/useWrongNetwork';
import { useAccountStore, useBridgeModeStore } from '@/store/store';
import { isEvmNetworkValid } from '@/utils/networkValidation';

interface ChainStatusProps {
  blockchain: Blockchain;
}

export function ChainStatus(props: ChainStatusProps) {
  const { blockchain } = props;

  const { connectedAccount, currentProvider } = useAccountStore();
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const { isValidMassaNetwork } = useMassaNetworkValidation();
  const { isConnected: isConnectedEVM, chain } = useAccount();

  const isMainnet = getIsMainnet();

  const isValidEvmNetwork = isEvmNetworkValid(isMainnet, chain?.id);

  const blockchainIsMassa = blockchain === Blockchain.MASSA;

  const isConnectMassa = !!connectedAccount;

  const isConnected = blockchainIsMassa
    ? isConnectMassa && !!currentProvider
    : isConnectedEVM;

  const networkIsValid = blockchainIsMassa
    ? isValidMassaNetwork
    : isValidEvmNetwork;

  return (
    <>
      {isConnected ? (
        networkIsValid ? (
          <Connected />
        ) : (
          <WrongChain blockchain={blockchain} />
        )
      ) : (
        <Disconnected />
      )}
    </>
  );
}
