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
  CONTRACT_ADDRESS,
  forwardBurnFees,
  increaseAllowanceFee,
} from '@/const';

export async function increaseAllowance(
  client: Client,
  targetAddress: string,
  amount: bigint,
): Promise<string> {
  console.log(
    'front increaseAllowance',
    new Args().addString(CONTRACT_ADDRESS).addU256(amount),
  );
  const opId = await client.smartContracts().callSmartContract({
    targetAddress,
    functionName: 'increaseAllowance',
    parameter: new Args()
      .addString(CONTRACT_ADDRESS)
      .addU256(amount)
      .serialize(),
    ...increaseAllowanceFee,
  });

  console.log('opid increaseAllowance', opId);

  await waitIncludedOperation(client, opId);

  return opId;
}

export async function forwardBurn(
  client: Client,
  evmAddress: string,
  tokenPair: TokenPair,
  amount: bigint,
): Promise<string> {
  const request = new ForwardingRequest(
    amount.toString(),
    evmAddress,
    tokenPair,
  );

  const opId = await client.smartContracts().callSmartContract({
    targetAddress: CONTRACT_ADDRESS,
    functionName: 'forwardBurn',
    parameter: new Args().addSerializable(request).serialize(),
    ...forwardBurnFees,
  });

  await waitIncludedOperation(client, opId);
  return opId;
}

export async function getSupportedTokensList(
  client: IClient,
): Promise<TokenPair[]> {
  const smartContractsClient: ISmartContractsClient = client.smartContracts();

  const returnObject = await smartContractsClient.readSmartContract({
    maxGas: MAX_GAS_CALL,
    targetAddress: CONTRACT_ADDRESS,
    targetFunction: 'supportedTokensList',
    parameter: [],
  } as IReadData);

  return bytesToSerializableObjectArray(returnObject.returnValue, TokenPair);
}
