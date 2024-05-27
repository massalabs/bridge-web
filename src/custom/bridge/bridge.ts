import {
  Args,
  Client,
  IReadData,
  MAX_GAS_CALL,
  bytesToSerializableObjectArray,
} from '@massalabs/massa-web3';
import { waitIncludedOperation } from './massa-utils';
import {
  useAccountStore,
  useBridgeModeStore,
  useTokenStore,
} from '../../store/store';
import { TokenPair } from '../serializable/tokenPair';
import { increaseAllowanceStorageCost } from '@/bridge/storage-cost';
import { config, increaseAllowanceFee } from '@/const';

export async function increaseAllowance(amount: bigint): Promise<string> {
  const { massaClient } = useAccountStore.getState();
  const { selectedToken } = useTokenStore.getState();
  const { currentMode } = useBridgeModeStore.getState();

  if (!massaClient) throw new Error('Massa client not found');
  if (!selectedToken) throw new Error('Token not selected');

  const readOnlyEstimation = await massaClient
    .smartContracts()
    .readSmartContract({
      targetAddress: selectedToken.massaToken,
      targetFunction: 'increaseAllowance',
      parameter: new Args()
        .addString(config[currentMode].massaBridgeContract)
        .addU256(amount)
        .serialize(),
      coins: await increaseAllowanceStorageCost(),
    });

  let maxGas = BigInt(Math.floor(readOnlyEstimation.info.gas_cost * 1.2));
  maxGas = maxGas > MAX_GAS_CALL ? MAX_GAS_CALL : maxGas;
  const opId = await massaClient.smartContracts().callSmartContract({
    targetAddress: selectedToken.massaToken,
    targetFunction: 'increaseAllowance',
    parameter: new Args()
      .addString(config[currentMode].massaBridgeContract)
      .addU256(amount)
      .serialize(),
    fee: increaseAllowanceFee.fee,
    coins: await increaseAllowanceStorageCost(),
    maxGas,
  });

  await waitIncludedOperation(opId);

  return opId;
}

export async function getSupportedTokensList(
  publicClient: Client,
): Promise<TokenPair[] | undefined> {
  const { currentMode } = useBridgeModeStore.getState();
  const contractAddress = config[currentMode].massaBridgeContract;

  if (!contractAddress) {
    console.warn(
      `Massa Bridge smart contract was not provided for: ${currentMode}`,
    );
    return undefined;
  }

  const returnObject = await publicClient.smartContracts().readSmartContract({
    targetAddress: contractAddress,
    targetFunction: 'supportedTokensList',
    parameter: [],
  } as IReadData);

  return bytesToSerializableObjectArray(returnObject.returnValue, TokenPair);
}
