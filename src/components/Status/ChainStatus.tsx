import { useAccount } from 'wagmi';
import { Connected, Disconnected, WrongChain } from '.';
import { Blockchain } from '@/const';
import {
  ChainContext,
  useEvmChainValidation,
  useMassaNetworkValidation,
} from '@/custom/bridge/useWrongNetwork';
import { useAccountStore } from '@/store/store';

interface ChainStatusProps {
  blockchain: Blockchain;
  context: ChainContext;
}

export function ChainStatus(props: ChainStatusProps) {
  const { blockchain, context } = props;

  const { connectedAccount, currentProvider } = useAccountStore();
  const isValidMassaNetwork = useMassaNetworkValidation();
  const { isConnected: isConnectedEVM } = useAccount();

  // Evm chain validation
  const isValidEvmNetwork = useEvmChainValidation(context);

  // Massa Chain Validation
  const isMassaChain = blockchain === Blockchain.MASSA;
  const isMassaChainConnected = !!connectedAccount && !!currentProvider;

  // verifies that target chain is connected
  const isTargetChainConnected = isMassaChain
    ? isMassaChainConnected
    : isConnectedEVM;

  const networkIsValid = isMassaChain ? isValidMassaNetwork : isValidEvmNetwork;

  return (
    <>
      {isTargetChainConnected ? (
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
