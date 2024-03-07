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

  if (blockchain === Blockchain.MASSA) {
    const isConnectMassa = !!connectedAccount;

    return (
      <>
        {isConnectMassa && !!currentProvider ? (
          isValidMassaNetwork ? (
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

  return (
    <>
      {isConnectedEVM ? (
        !isValidEvmNetwork ? (
          <WrongChain blockchain={blockchain} />
        ) : (
          <Connected />
        )
      ) : (
        <Disconnected />
      )}
    </>
  );
}
