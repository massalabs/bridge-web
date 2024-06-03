import { useAccount } from 'wagmi';
import { bsc, bscTestnet, mainnet, sepolia } from 'wagmi/chains';
import { Blockchain } from '@/const';

export function useConnectedEvmChain(): Blockchain {
  const { chain } = useAccount();
  if (chain?.id === bsc.id || chain?.id === bscTestnet.id)
    return Blockchain.BSC;
  if (chain?.id === mainnet.id || chain?.id === sepolia.id)
    return Blockchain.ETHEREUM;
  return Blockchain.UNKNOWN;
}
