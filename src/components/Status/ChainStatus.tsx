import { useAccount } from 'wagmi';
import { Connected, Disconnected, WrongChain } from '.';
import { Blockchain } from '@/const';
import {
  useWrongNetworkBsc,
  useWrongNetworkEVM,
  useWrongNetworkMASSA,
} from '@/custom/bridge/useWrongNetwork';
import { useAccountStore } from '@/store/store';

interface ChainStatusProps {
  blockchain: Blockchain;
}

export function ChainStatus(props: ChainStatusProps) {
  const { blockchain } = props;

  const { wrongNetwork: wrongNetworkMassa } = useWrongNetworkMASSA();
  const { connectedAccount, currentProvider } = useAccountStore();

  const { wrongNetwork: wrongNetworkEVM } = useWrongNetworkEVM();
  const { wrongNetwork: wrongNetworkBsc } = useWrongNetworkBsc();
  const { isConnected: isConnectedEVM } = useAccount();

  if (blockchain === Blockchain.MASSA) {
    const isConnectMassa = !!connectedAccount;

    return (
      <>
        {isConnectMassa && !!currentProvider ? (
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

  return (
    <>
      {isConnectedEVM ? (
        wrongNetworkEVM || wrongNetworkBsc ? (
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
