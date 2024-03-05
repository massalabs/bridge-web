import { useAccount } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';

export function useIsBscConnected() {
  const { chain } = useAccount();
  return chain?.id === bsc.id || chain?.id === bscTestnet.id;
}
