import { useCallback } from 'react';
import { Args } from '@massalabs/massa-web3';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { handleBurnError } from './handlers/handleTransactionErrors';
import { ForwardingRequest } from '../serializable/request';
import { TokenPair } from '../serializable/tokenPair';
import { config, forwardBurnFees } from '@/const';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import {
  useAccountStore,
  useBridgeModeStore,
  useOperationStore,
} from '@/store/store';
import { useTokenStore } from '@/store/tokenStore';

export function useBurn() {
  const { setBox, setBurn } = useGlobalStatusesStore();
  const { massaClient } = useAccountStore();
  const { selectedToken } = useTokenStore();
  const { currentMode } = useBridgeModeStore();
  const { setBurnTxId, amount } = useOperationStore();
  const { address: evmAddress } = useAccount();

  const handleBurnRedeem = useCallback(async () => {
    if (!amount) throw new Error('Amount not found');
    if (!massaClient) throw new Error('Massa client not found');
    if (!selectedToken) throw new Error('Token not selected');

    const amt = parseUnits(amount, selectedToken.decimals);

    const tokenPair = new TokenPair(
      selectedToken.massaToken,
      selectedToken.evmToken,
      selectedToken.chainId,
    );

    const request = new ForwardingRequest(amt, evmAddress, tokenPair);

    try {
      const opId = await massaClient.smartContracts().callSmartContract({
        targetAddress: config[currentMode].massaBridgeContract,
        targetFunction: 'forwardBurn',
        parameter: new Args().addSerializable(request).serialize(),
        ...forwardBurnFees,
      });
      setBurnTxId(opId);
    } catch (error) {
      handleBurnError(error);
      setBox(Status.Error);
      setBurn(Status.Error);
    }
  }, [
    amount,
    evmAddress,
    massaClient,
    selectedToken,
    currentMode,
    setBurnTxId,
    setBox,
    setBurn,
  ]);

  return { handleBurnRedeem };
}
