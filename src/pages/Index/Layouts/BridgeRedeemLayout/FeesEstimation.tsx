import { useEffect, useState } from 'react';
import { MassaLogo } from '@massalabs/react-ui-kit';
import {
  erc20ABI,
  fetchFeeData,
  getConfig,
  mainnet,
  sepolia,
} from '@wagmi/core';
import { formatEther, parseUnits } from 'viem';
import { useAccount, useToken } from 'wagmi';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { EthSvgRed } from '@/assets/EthSvgRed';
import { EVM_CONTRACT_ABI, U256_MAX, config } from '@/const';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
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
  const { allowance } = useEvmBridge();

  const massaToEvm = side === SIDE.MASSA_TO_EVM;
  const evmToken = selectedToken?.evmToken as `0x${string}`;
  const { data: tokenData } = useToken({ address: evmToken });
  const bridgeContractAddr = config[currentMode].evmBridgeContract;

  const [feesETH, setFeesETH] = useState('');

  useEffect(() => {
    let gasPrice = 0n;
    fetchFeeData({
      chainId: isMainnet ? mainnet.id : sepolia.id,
    })
      .then((feeData) => {
        gasPrice = feeData.maxFeePerGas || 0n;
        console.log('feeData', feeData); // DEBUG
        console.log('gasPrice', gasPrice); // DEBUG
        const publicClient = getConfig().getPublicClient();
        if (!accountAddress || !massaAccount || !tokenData) {
          return Promise.all([Promise.resolve(0n), Promise.resolve(0n)]);
        }

        const amountInBigInt = parseUnits(amount || '0', tokenData.decimals);

        if (massaToEvm) {
          // claim
          return Promise.all([Promise.resolve(92261n), Promise.resolve(0n)]);
        } else {
          // approve and lock
          const lockGasEstimationPromise = publicClient.estimateContractGas({
            functionName: EVM_CONTRACT_ABI.LOCK,
            address: bridgeContractAddr,
            abi: bridgeVaultAbi,
            args: [amountInBigInt, massaAccount.address(), evmToken],
            account: accountAddress,
          });

          let approveGasEstimationPromise;
          if (allowance < amountInBigInt) {
            approveGasEstimationPromise = publicClient.estimateContractGas({
              functionName: EVM_CONTRACT_ABI.APPROVE as 'approve',
              address: evmToken,
              abi: erc20ABI,
              args: [bridgeContractAddr, U256_MAX],
              account: accountAddress,
            });
          } else {
            approveGasEstimationPromise = Promise.resolve(0n);
          }

          return Promise.all([
            lockGasEstimationPromise,
            approveGasEstimationPromise,
          ]);
        }
      })
      .then(([firstEstimation, secondEstimation]) => {
        return firstEstimation + secondEstimation;
      })
      .then((estimatedGas) => {
        setFeesETH(formatEther(estimatedGas * gasPrice));
      });
  }, [
    massaAccount,
    accountAddress,
    amount,
    massaToEvm,
    evmToken,
    setFeesETH,
    bridgeContractAddr,
    isMainnet,
    tokenData,
    allowance,
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
