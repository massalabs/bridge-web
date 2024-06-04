import { useAccount } from 'wagmi';
import { Connected, Disconnected, WrongChain } from '.';
import { Blockchain, SupportedEvmBlockchain } from '@/const';
import {
  ChainContext,
  useEvmChainValidation,
  useMassaNetworkValidation,
} from '@/custom/bridge/useNetworkValidation';
import { useAccountStore } from '@/store/store';

interface ChainStatusProps {
  blockchain: Blockchain | SupportedEvmBlockchain;
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
