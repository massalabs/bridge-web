import { useLocation } from 'react-router-dom';
import { bsc, bscTestnet, mainnet, sepolia } from 'viem/chains';
import { useAccount } from 'wagmi';
import { Connected, Disconnected, WrongChain } from '.';
import { Blockchain, PAGES } from '@/const';
import { useMassaNetworkValidation } from '@/custom/bridge/useWrongNetwork';
import { useAccountStore, useBridgeModeStore } from '@/store/store';

interface ChainStatusProps {
  blockchain: Blockchain;
}

export function ChainStatus(props: ChainStatusProps) {
  const { blockchain } = props;

  const { pathname } = useLocation();
  const { connectedAccount, currentProvider } = useAccountStore();
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const { isValidMassaNetwork } = useMassaNetworkValidation();
  const { isConnected: isConnectedEVM, chain } = useAccount();

  const isMainnet = getIsMainnet();

  // Massa Chain Validation
  const isMassaChain = blockchain === Blockchain.MASSA;
  const isMassaChainConnected = !!connectedAccount && !!currentProvider;

  // Evm chain validation
  function evmChainValidation(): boolean {
    if (pathname === `/${PAGES.DAO}`) {
      const targetChainId = isMainnet ? bsc.id : bscTestnet.id;
      return chain?.id === targetChainId;
    }
    const targetChainId = isMainnet ? mainnet.id : sepolia.id;
    return chain?.id === targetChainId;
  }

  // verifies that bolth chains are connected
  const isEvmAndMassaConnected = isMassaChain
    ? isMassaChainConnected
    : isConnectedEVM;

  const networkIsValid = isMassaChain
    ? isValidMassaNetwork
    : evmChainValidation();

  return (
    <>
      {isEvmAndMassaConnected ? (
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
