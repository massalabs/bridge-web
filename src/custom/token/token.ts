import {
  Args,
  bytesToStr,
  IContractReadOperationResponse,
  IEvent,
  IClient,
  ISmartContractsClient,
  IEventFilter,
} from '@massalabs/massa-web3';
import { IAccount } from '@massalabs/wallet-provider';
import { bytesToU256 } from '@massalabs/web3-utils';

import { CONTRACT_ADDRESS } from '@/const';
import { parseAmount } from '@/utils/parseAmount';

export async function getInfo(
  client: IClient,
  targetFunction: string,
  targetAddress: string,
  parameter: Array<number>,
): Promise<IContractReadOperationResponse> {
  const smartContractsClient: ISmartContractsClient = client.smartContracts();

  return smartContractsClient.readSmartContract({
    maxGas: BigInt(1000000),
    targetAddress: targetAddress,
    targetFunction: targetFunction,
    parameter: parameter,
  });
}

export async function getMassaTokenName(
  targetAddress: string,
  client: IClient,
): Promise<string> {
  let returnObject = await getInfo(client, 'name', targetAddress, []);

  return bytesToStr(returnObject.returnValue);
}

export async function getMassaTokenSymbol(
  targetAddress: string,
  client: IClient,
): Promise<string> {
  let returnObject = await getInfo(client, 'symbol', targetAddress, []);

  return bytesToStr(returnObject.returnValue);
}

export async function getAllowance(
  targetAddress: string,
  client: IClient,
  account: IAccount,
): Promise<string> {
  let args = new Args()
    .addString(account.address())
    .addString(CONTRACT_ADDRESS)
    .serialize();

  let { returnValue: decimals } = await getInfo(
    client,
    'decimals',
    targetAddress,
    [],
  );
  let { returnValue: allowance } = await getInfo(
    client,
    'allowance',
    targetAddress,
    args,
  );

  return parseAmount(
    bytesToU256(allowance).toString(),
    Number(decimals),
  ).toString();
}

export async function getDecimals(
  targetAddress: string,
  client: IClient,
): Promise<string> {
  let returnObject = await getInfo(client, 'decimals', targetAddress, []);

  return returnObject.returnValue.toString();
}

export async function getFilteredScOutputEvents(
  client: IClient,
): Promise<IEvent[]> {
  const smartContractsClient: ISmartContractsClient = client.smartContracts();

  let returnObject = await smartContractsClient.getFilteredScOutputEvents({
    start: null,
    end: null,
    emitter_address: CONTRACT_ADDRESS,
    is_final: true,
  } as IEventFilter);

  return returnObject;
}

export async function getBalance(
  targetAddress: string,
  client: IClient,
  account: IAccount,
): Promise<string> {
  const args = new Args().addString(account.address()).serialize();
  const returnObject = await getInfo(client, 'balanceOf', targetAddress, args);

  return bytesToU256(returnObject.returnValue).toString();
}
