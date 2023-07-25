import { Args, bytesToSerializableObjectArray } from '@massalabs/massa-web3';
import { IAccount } from '@massalabs/wallet-provider';
import { TokenPair } from '../serializable/tokenPair';
import { ForwardingRequest } from '../serializable/request';

const CONTRACT_ADDRESS = 'AS1iRUPh5qxSYbJ4PBPbKWGSr49jiB7M6kf4hPy7whG2zjcYa7HR';

export async function increaseAllowance(
  account: IAccount | undefined,
  tokenAddress: string,
  amount: bigint,
): Promise<any> {
  if (!account) {
    throw new Error('Account is not defined');
  }
  const result = await account?.callSC(
    tokenAddress,
    'increaseAllowance',
    new Args().addString(CONTRACT_ADDRESS).addU256(amount),
    BigInt(100),
  );
  return result;
}

export async function forwardBurn(
  account: IAccount | undefined,
  tokenPair: TokenPair | undefined,
): Promise<any> {
  if (!account) {
    throw new Error('Account is not defined');
  }
  if (!tokenPair) {
    throw new Error('TokenPair is not defined');
  }

  const request = new ForwardingRequest('10', account.address(), tokenPair);

  const result = await account?.callSC(
    CONTRACT_ADDRESS,
    'forwardBurn',
    new Args().addSerializable(request),
    BigInt(1000),
  );

  return result;
}

export async function getSupportedTokensList(
  account: IAccount | undefined,
): Promise<TokenPair[]> {
  if (!account) {
    throw new Error('Account is not defined');
  }
  const returnObject = await account.callSC(
    CONTRACT_ADDRESS,
    'supportedTokensList',
    new Uint8Array(),
    BigInt(0),
    { isNPE: true, maxGas: BigInt(1000000) },
  );

  return bytesToSerializableObjectArray(returnObject.returnValue, TokenPair);
}
