import { useAccount } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { SupportedEvmBlockchain } from '@/const';

export function useConnectedEvmChain(): SupportedEvmBlockchain {
  const { chain } = useAccount();
  if (chain?.id === bsc.id || chain?.id === bscTestnet.id) {
    return SupportedEvmBlockchain.BSC;
  }
  return SupportedEvmBlockchain.ETH;
}
