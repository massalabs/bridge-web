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
  account: IAccount,
  tokenAddress: string,
  amount: bigint,
): Promise<string> {
  return account?.callSC(
    tokenAddress,
    'increaseAllowance',
    new Args().addString(CONTRACT_ADDRESS).addU256(amount),
    BigInt(100),
  );
}

export async function forwardBurn(
  account: IAccount,
  tokenPair: TokenPair,
  amount: string,
): Promise<string> {

  const request = new ForwardingRequest(amount, account.address(), tokenPair);

  return account.callSC(
    CONTRACT_ADDRESS,
    'forwardBurn',
    new Args().addSerializable(request),
    BigInt(1000),
  );
}

export async function getSupportedTokensList(
  account: IAccount,
): Promise<TokenPair[]> {
  const returnObject: IContractReadOperationResponse = await account.callSC(
    CONTRACT_ADDRESS,
    'supportedTokensList',
    new Uint8Array(),
    BigInt(0),
    { isNPE: true, maxGas: BigInt(1000000) },
  );

  return bytesToSerializableObjectArray(returnObject.returnValue, TokenPair);
}
