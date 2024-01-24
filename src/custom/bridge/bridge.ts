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
import { ForwardingRequest } from '../serializable/request';
import { TokenPair } from '../serializable/tokenPair';
import { config, forwardBurnFees, increaseAllowanceFee } from '@/const';

export async function increaseAllowance(amount: bigint): Promise<string> {
  const { massaClient } = useAccountStore.getState();
  const { selectedToken } = useTokenStore.getState();
  const { currentMode } = useBridgeModeStore.getState();

  const opId = await massaClient!.smartContracts().callSmartContract({
    targetAddress: selectedToken!.massaToken,
    functionName: 'increaseAllowance',
    parameter: new Args()
      .addString(config[currentMode].massaBridgeContract)
      .addU256(amount)
      .serialize(),
    ...increaseAllowanceFee,
  });

  await waitIncludedOperation(opId);

  return opId;
}

export async function forwardBurn(
  recipient: string,
  amount: string,
): Promise<string> {
  const { massaClient } = useAccountStore.getState();
  const { selectedToken } = useTokenStore.getState();
  const { currentMode } = useBridgeModeStore.getState();

  const tokenPair = new TokenPair(
    selectedToken!.massaToken,
    selectedToken!.evmToken,
    selectedToken!.chainId,
  );

  const request = new ForwardingRequest(amount, recipient, tokenPair);

  const opId = await massaClient!.smartContracts().callSmartContract({
    targetAddress: config[currentMode].massaBridgeContract,
    functionName: 'forwardBurn',
    parameter: new Args().addSerializable(request).serialize(),
    ...forwardBurnFees,
  });

  return opId;
}

export async function getSupportedTokensList(
  publicClient: Client,
): Promise<TokenPair[]> {
  const { currentMode } = useBridgeModeStore.getState();

  const returnObject = await publicClient.smartContracts().readSmartContract({
    maxGas: MAX_GAS_CALL,
    targetAddress: config[currentMode].massaBridgeContract,
    targetFunction: 'supportedTokensList',
    parameter: [],
  } as IReadData);

  return bytesToSerializableObjectArray(returnObject.returnValue, TokenPair);
}
