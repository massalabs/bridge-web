import { erc20Abi } from 'viem';
import { useAccount, useReadContracts } from 'wagmi';
import { CHAIN_ID_TO_SUPPORTED_BLOCKCHAIN, config } from '@/const/const';
import { useBridgeModeStore, useTokenStore } from '@/store/store';

const useEvmToken = () => {
  const { address: accountAddress } = useAccount();
  const { selectedToken } = useTokenStore();
  const { currentMode } = useBridgeModeStore();
  const { chainId } = useAccount();

  const chain = chainId || 0;

  const bridgeContractAddr =
    config[currentMode][CHAIN_ID_TO_SUPPORTED_BLOCKCHAIN[chain]];

  const evmToken = selectedToken?.evmToken as `0x${string}`;

  const tokenContract = {
    address: evmToken,
    abi: erc20Abi,
  };

  const { data, isFetched } = useReadContracts({
    contracts: [
      {
        ...tokenContract,
        functionName: 'balanceOf',
        args: [accountAddress!],
      },
      {
        ...tokenContract,
        functionName: 'allowance',
        args: [accountAddress!, bridgeContractAddr],
      },
    ],
    query: {
      enabled: !!selectedToken && !!accountAddress,
    },
  });

  return {
    isFetched,
    tokenBalance: data?.[0].status === 'success' ? data[0].result : 0n,
    allowance: data?.[1].status === 'success' ? data[1].result : 0n,
  };
};

export default useEvmToken;
