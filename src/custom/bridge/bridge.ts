import {
  Args,
  IClient,
  IReadData,
  ISmartContractsClient,
  bytesToSerializableObjectArray,
} from '@massalabs/massa-web3';
import { IAccount } from '@massalabs/wallet-provider';

import { ForwardingRequest } from '../serializable/request';
import { TokenPair } from '../serializable/tokenPair';
import { CONTRACT_ADDRESS } from '@/const';

export async function increaseAllowance(
  account: IAccount | undefined,
  tokenAddress: string,
  amount: bigint,
): Promise<string> {
  if (!account) {
    throw new Error('Account is not defined');
  }
  const opId = await account.callSC(
    tokenAddress,
    'increaseAllowance',
    new Args().addString(CONTRACT_ADDRESS).addU256(amount),
    BigInt(1000),
    BigInt(0),
    BigInt(1000000),
  );
  return opId;
}

export async function forwardBurn(
  account?: IAccount,
  evmAddress?: string,
  tokenPair?: TokenPair,
  amount?: string,
): Promise<string> {
  if (!account) {
    throw new Error('Account is not defined');
  }
  if (!tokenPair) {
    throw new Error('TokenPair is not defined');
  }

  const request = new ForwardingRequest(
    amount?.toString(),
    evmAddress,
    tokenPair,
  );

  const opId = await account?.callSC(
    CONTRACT_ADDRESS,
    'forwardBurn',
    new Args().addSerializable(request),
    BigInt(1000),
    BigInt(0),
    BigInt(1000000),
  );

  return opId;
}

export async function getSupportedTokensList(
  client: IClient,
): Promise<TokenPair[]> {
  const smartContractsClient: ISmartContractsClient = client.smartContracts();

  const returnObject = await smartContractsClient.readSmartContract({
    maxGas: BigInt(1000000),
    targetAddress: CONTRACT_ADDRESS,
    targetFunction: 'supportedTokensList',
    parameter: [],
  } as IReadData);

  return bytesToSerializableObjectArray(returnObject.returnValue, TokenPair);
}
