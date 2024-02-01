import { useEffect, useState } from 'react';
import { MassaLogo } from '@massalabs/react-ui-kit';
import {
  erc20ABI,
  fetchFeeData,
  getConfig,
  mainnet,
  sepolia,
} from '@wagmi/core';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { EthSvgRed } from '@/assets/EthSvgRed';
import { EVM_CONTRACT_ABI, U256_MAX, config } from '@/const';
import {
  useAccountStore,
  useBridgeModeStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';
import { SIDE } from '@/utils/const';

interface FeesEstimationProps {
  amount: string | undefined;
}

export function FeesEstimation(props: FeesEstimationProps) {
  const { amount } = props;
  const { selectedToken } = useTokenStore();
  const { address: accountAddress } = useAccount();
  const { connectedAccount: massaAccount } = useAccountStore();
  const { side } = useOperationStore();
  const { currentMode, isMainnet } = useBridgeModeStore();

  const massaToEvm = side === SIDE.MASSA_TO_EVM;
  const evmToken = selectedToken?.evmToken as `0x${string}`;
  const bridgeContractAddr = config[currentMode].evmBridgeContract;

  const [feesETH, setFeesETH] = useState('');

  useEffect(() => {
    if (feesETH === '') {
      let gasPrice = 0n;
      fetchFeeData({
        chainId: isMainnet ? mainnet.id : sepolia.id,
      })
        .then((feeData) => {
          gasPrice = feeData.gasPrice || 0n;
          if (massaToEvm) {
            // claim
            return Promise.all([Promise.resolve(0n), Promise.resolve(0n)]);
          } else {
            // approve and lock
            const publicClient = getConfig().getPublicClient();
            if (!accountAddress || !massaAccount) {
              return Promise.all([Promise.resolve(0n), Promise.resolve(0n)]);
            }
            // Estimate gas for the "LOCK" function
            const lockGasEstimationPromise = publicClient.estimateContractGas({
              functionName: EVM_CONTRACT_ABI.LOCK,
              address: bridgeContractAddr,
              abi: bridgeVaultAbi,
              args: [amount || '0', massaAccount.address(), evmToken],
              account: accountAddress,
            });

            // Estimate gas for the "APPROVE" function
            // TODO: only if approve is needed
            const approveGasEstimationPromise =
              publicClient.estimateContractGas({
                functionName: EVM_CONTRACT_ABI.APPROVE as 'approve',
                address: evmToken,
                abi: erc20ABI,
                args: [bridgeContractAddr, U256_MAX],
                account: accountAddress,
              });

            return Promise.all([
              lockGasEstimationPromise,
              approveGasEstimationPromise,
            ]);
          }
        })
        .then(([lockEstimatedGas, approveEstimatedGas]) => {
          return lockEstimatedGas + approveEstimatedGas;
        })
        .then((estimatedGas) => {
          setFeesETH(formatEther(estimatedGas * gasPrice));
        });
    }
  }, [
    massaAccount,
    accountAddress,
    amount,
    feesETH,
    massaToEvm,
    evmToken,
    setFeesETH,
    bridgeContractAddr,
    isMainnet,
  ]);

  if (!selectedToken) return null;

  const symbolEVM = selectedToken.symbol;
  const symbolMASSA = symbolEVM + '.e';

  const feesMAS = '0';

  return (
    <div>
      <div className="flex items-center justify-between">
        <p>Bridge Rate</p>
        <div className="flex items-center">
          1 {symbolEVM} on{' '}
          <span className="mx-1">
            <EthSvgRed />
          </span>{' '}
          = 1 {symbolMASSA} on{' '}
          <span className="ml-1">
            <MassaLogo size={20} />
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p>Massa fees</p>
        {/* potential tooltip here */}
        <div className="flex items-center">{feesMAS} MAS</div>
      </div>
      <div className="flex items-center justify-between">
        <p>EVM fees</p>
        {/* potential tooltip here */}
        <div className="flex items-center">{feesETH} ETH</div>
      </div>
    </div>
  );
}
