import { Eth, Sepolia, Bsc } from '@massalabs/react-ui-kit';
import { mainnet, sepolia, bsc, bscTestnet } from 'viem/chains';

interface EvmIcons {
  [key: number]: JSX.Element;
}

export function getEvmNetworkIcon(chainId: number, size = 16) {
  const evmIcons: EvmIcons = {
    [mainnet.id]: <Eth size={size} />,
    [sepolia.id]: <Sepolia size={size} />,
    [bsc.id]: <Bsc size={size} />,
    [bscTestnet.id]: <Bsc size={size} />,
  };

  return evmIcons[chainId];
}

export function getEvmChainName(chainId: number) {
  const chains = [mainnet, sepolia, bsc, bscTestnet];

  return chains.find((x) => x.id === chainId)?.name;
}
