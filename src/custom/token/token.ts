import { Args, bytesToStr } from '@massalabs/massa-web3';
import { IAccount } from '@massalabs/wallet-provider';

export async function getInfo(
  infoType: string,
  tokenAddress: string,
  account?: IAccount,
  args?: Args,
): Promise<any> {
  if (!account) {
    throw new Error('Account is not defined');
  }
  const returnObject = await account.callSC(
    tokenAddress,
    infoType,
    args || new Uint8Array(),
    BigInt(0),
    { isNPE: true, maxGas: BigInt(1000000) },
  );

  return bytesToStr(new Uint8Array(returnObject.returnValue));
}

export async function getMassaTokenName(
  tokenAddress: string,
  account: IAccount,
): Promise<string> {
  return getInfo(
    'name',
    tokenAddress,
    account,
    new Args().addString(account.address()),
  );
}
