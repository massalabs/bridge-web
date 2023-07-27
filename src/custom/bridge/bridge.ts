import {
  Args,
  IContractReadOperationResponse,
  bytesToSerializableObjectArray,
} from '@massalabs/massa-web3';
import { IAccount } from '@massalabs/wallet-provider';
import { TokenPair } from '../serializable/tokenPair';
import { ForwardingRequest } from '../serializable/request';

const CONTRACT_ADDRESS = 'AS1crhHVfdykXmoV73LFAaRgqLMRuLZEeJy8FQCQYc73NNnW3Utf';

export async function increaseAllowance(
  account: IAccount | undefined,
  tokenAddress: string,
  amount: bigint,
): Promise<string> {
  if (!account) {
    throw new Error('Account is not defined');
  }
  const opId = await account?.callSC(
    tokenAddress,
    'increaseAllowance',
    new Args().addString(CONTRACT_ADDRESS).addU256(amount),
    BigInt(100),
  );
  return opId;
}

export async function forwardBurn(
  account?: IAccount,
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
    account.address(),
    tokenPair,
  );

  const opId = await account?.callSC(
    CONTRACT_ADDRESS,
    'forwardBurn',
    new Args().addSerializable(request),
    BigInt(1000),
  );

  return opId;
}

export async function getSupportedTokensList(
  account: IAccount | undefined,
): Promise<TokenPair[]> {
  if (!account) {
    throw new Error('Account is not defined');
  }
  const returnObject: IContractReadOperationResponse = await account.callSC(
    CONTRACT_ADDRESS,
    'supportedTokensList',
    new Uint8Array(),
    BigInt(0),
    { isNPE: true, maxGas: BigInt(1000000) },
  );

  return bytesToSerializableObjectArray(returnObject.returnValue, TokenPair);
}
