import { useAccount } from 'wagmi';
import { Connected, Disconnected, WrongChain } from '.';
import { Blockchain } from '@/const';
import { useIsBnbConnected } from '@/custom/bridge/useIsBnbConnected';
import {
  useBnbNetworkValidation,
  useEthNetworkValidation,
  useMassaNetworkValidation,
} from '@/custom/bridge/useWrongNetwork';
import { useAccountStore } from '@/store/store';

interface ChainStatusProps {
  blockchain: Blockchain;
}

export function ChainStatus(props: ChainStatusProps) {
  const { blockchain } = props;

  const { connectedAccount, currentProvider } = useAccountStore();

  const { isValidMassaNetwork } = useMassaNetworkValidation();
  const { isValidEthNetwork } = useEthNetworkValidation();
  const { isValidBnbNetwork } = useBnbNetworkValidation();
  const { isConnected: isConnectedEVM } = useAccount();

  const isBnbConnected = useIsBnbConnected();

  function getIsInvalidNetwork() {
    if (isBnbConnected) {
      return !isValidBnbNetwork;
    }
    return !isValidEthNetwork;
  }

  const isInvalidNetwork = getIsInvalidNetwork();

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
        isInvalidNetwork ? (
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
