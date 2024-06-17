import { useCallback } from 'react';
import { Args, EOperationStatus, MAX_GAS_CALL } from '@massalabs/massa-web3';
import { useAccount } from 'wagmi';
import { handleBurnError } from './handlers/handleTransactionErrors';
import { ForwardingRequest } from '../serializable/request';
import { TokenPair } from '../serializable/tokenPair';
import { config } from '@/const';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import {
  useAccountStore,
  useBridgeModeStore,
  useOperationStore,
} from '@/store/store';
import { useTokenStore } from '@/store/tokenStore';

// Transaction fees
export const forwardBurnFees = {
  fee: 10_000_000n,
  coins: 0n,
};

export function useBurn() {
  const { setBox, setBurn } = useGlobalStatusesStore();
  const { massaClient } = useAccountStore();
  const { selectedToken } = useTokenStore();
  const { currentMode } = useBridgeModeStore();
  const { setBurnTxId, inputAmount: amount } = useOperationStore();
  const { address: evmAddress } = useAccount();

  const handleBurnRedeem = useCallback(async () => {
    if (!amount) throw new Error('Amount not found');
    if (!massaClient) throw new Error('Massa client not found');
    if (!selectedToken) throw new Error('Token not selected');

    const tokenPair = new TokenPair(
      selectedToken.massaToken,
      selectedToken.evmToken,
      selectedToken.chainId,
    );

    const request = new ForwardingRequest(amount, evmAddress, tokenPair);

    try {
      const callData = {
        targetAddress: config[currentMode].massaBridgeContract,
        targetFunction: 'forwardBurn',
        parameter: new Args().addSerializable(request).serialize(),
      };
      const readOnlyEstimation = await massaClient
        .smartContracts()
        .readSmartContract(callData);

      let maxGas = BigInt(Math.floor(readOnlyEstimation.info.gas_cost * 1.2));
      maxGas = maxGas > MAX_GAS_CALL ? MAX_GAS_CALL : maxGas;

      const opId = await massaClient.smartContracts().callSmartContract({
        ...callData,
        maxGas,
        ...forwardBurnFees,
      });

      setBurnTxId(opId);

      const operationStatus = await massaClient
        .smartContracts()
        .awaitMultipleRequiredOperationStatus(
          opId,
          [
            EOperationStatus.SPECULATIVE_ERROR,
            EOperationStatus.SPECULATIVE_SUCCESS,
          ],
          200_000,
        );

      if (operationStatus === EOperationStatus.SPECULATIVE_ERROR) {
        await massaClient
          .smartContracts()
          .getFilteredScOutputEvents({
            emitter_address: null,
            start: null,
            end: null,
            original_caller_address: null,
            original_operation_id: opId,
            is_final: null,
          })
          .then((events) => {
            events.map((l) => {
              throw new Error(`opId ${opId}: execution error ${l.data}`);
            });
          });
      }
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
