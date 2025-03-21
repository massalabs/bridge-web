import { useAccount } from 'wagmi';
import { Connected, Disconnected, WrongChain } from '.';
import {
  ChainContext,
  useEvmChainValidation,
  useMassaNetworkValidation,
} from '@/custom/bridge/useNetworkValidation';
import { useAccountStore } from '@/store/store';

interface ChainStatusProps {
  isMassaChain: boolean;
  context: ChainContext;
}

export function ChainStatus(props: ChainStatusProps) {
  const { isMassaChain, context } = props;

  const { connectedAccount, currentProvider } = useAccountStore();
  const isValidMassaNetwork = useMassaNetworkValidation();
  const { isConnected: isConnectedEVM } = useAccount();

  // Evm chain validation
  const isValidEvmNetwork = useEvmChainValidation(context);

  // Massa Chain Validation
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
          <WrongChain isMassaChain={isMassaChain} />
        )
      ) : (
        <Disconnected />
      )}
    </>
  );
}
