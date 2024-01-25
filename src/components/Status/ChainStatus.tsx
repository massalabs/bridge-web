import { useAccount } from 'wagmi';
import { Connected, Disconnected, WrongChain } from '.';
import { Blockchain } from '@/const';
import {
  useWrongNetworkEVM,
  useWrongNetworkMASSA,
} from '@/custom/bridge/useWrongNetwork';
import { useAccountStore } from '@/store/store';

interface ChainStatusProps {
  blockchain: Blockchain;
}

export function ChainStatus(props: ChainStatusProps) {
  const { blockchain } = props;

  if (blockchain === Blockchain.MASSA) {
    const { wrongNetwork: wrongNetworkMassa } = useWrongNetworkMASSA();
    const { connectedAccount } = useAccountStore();
    const isConnectMassa = !!connectedAccount;

    return (
      <>
        {isConnectMassa ? (
          wrongNetworkMassa ? (
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

  const { wrongNetwork: wrongNetworkEVM } = useWrongNetworkEVM();
  const { isConnected: isConnectedEVM } = useAccount();

  return (
    <>
      {isConnectedEVM ? (
        wrongNetworkEVM ? (
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
