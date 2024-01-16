import {
  Args,
  Client,
  IClient,
  IReadData,
  ISmartContractsClient,
  MAX_GAS_CALL,
  bytesToSerializableObjectArray,
} from '@massalabs/massa-web3';

import { waitIncludedOperation } from './massa-utils';
import { ForwardingRequest } from '../serializable/request';
import { TokenPair } from '../serializable/tokenPair';
import {
  BridgeMode,
  config,
  forwardBurnFees,
  increaseAllowanceFee,
} from '@/const';

export async function increaseAllowance(
  mode: BridgeMode,
  client: Client,
  targetAddress: string,
  amount: bigint,
): Promise<string> {
  const opId = await client.smartContracts().callSmartContract({
    targetAddress,
    functionName: 'increaseAllowance',
    parameter: new Args()
      .addString(config[mode].massaBridgeContract)
      .addU256(amount)
      .serialize(),
    ...increaseAllowanceFee,
  });

  await waitIncludedOperation(client, opId);

  return opId;
}

export async function forwardBurn(
  mode: BridgeMode,
  client: Client,
  recipient: string,
  tokenPair: TokenPair,
  amount: bigint,
): Promise<string> {
  const request = new ForwardingRequest(
    amount.toString(),
    recipient,
    tokenPair,
  );
  const opId = await client.smartContracts().callSmartContract({
    targetAddress: config[mode].massaBridgeContract,
    functionName: 'forwardBurn',
    parameter: new Args().addSerializable(request).serialize(),
    ...forwardBurnFees,
  });
  return opId;
}

export async function getSupportedTokensList(
  mode: BridgeMode,
  client: IClient,
): Promise<TokenPair[]> {
  const smartContractsClient: ISmartContractsClient = client.smartContracts();

  const returnObject = await smartContractsClient.readSmartContract({
    maxGas: MAX_GAS_CALL,
    targetAddress: config[mode].massaBridgeContract,
    targetFunction: 'supportedTokensList',
    parameter: [],
  } as IReadData);

  return bytesToSerializableObjectArray(returnObject.returnValue, TokenPair);
}
