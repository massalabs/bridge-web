import {
  Args,
  bytesToStr,
  byteToU8,
  IEvent,
  IClient,
} from '@massalabs/massa-web3';
import { IAccount } from '@massalabs/wallet-provider';
import { bytesToU256 } from '@massalabs/web3-utils';

import { CONTRACT_ADDRESS } from '@/const';

export async function readSC(
  client: IClient,
  targetFunction: string,
  targetAddress: string,
  parameter: Array<number>,
): Promise<Uint8Array> {
  const res = await client.smartContracts().readSmartContract({
    maxGas: BigInt(1000000),
    targetAddress: targetAddress,
    targetFunction: targetFunction,
    parameter: parameter,
  });

  return res.returnValue;
}

export async function getMassaTokenName(
  targetAddress: string,
  client: IClient,
): Promise<string> {
  return bytesToStr(await readSC(client, 'name', targetAddress, []));
}

export async function getMassaTokenSymbol(
  targetAddress: string,
  client: IClient,
): Promise<string> {
  return bytesToStr(await readSC(client, 'symbol', targetAddress, []));
}

export async function getAllowance(
  targetAddress: string,
  client: IClient,
  account: IAccount,
): Promise<bigint> {
  const args = new Args()
    .addString(account.address())
    .addString(CONTRACT_ADDRESS)
    .serialize();

  const allowance = await readSC(client, 'allowance', targetAddress, args);

  return bytesToU256(allowance);
}

export async function getDecimals(
  targetAddress: string,
  client: IClient,
): Promise<number> {
  return byteToU8(await readSC(client, 'decimals', targetAddress, []));
}

export async function getFilteredScOutputEvents(
  client: IClient,
): Promise<IEvent[]> {
  return client.smartContracts().getFilteredScOutputEvents({
    start: null,
    end: null,
    original_caller_address: CONTRACT_ADDRESS,
    original_operation_id: null,
    emitter_address: null,
    is_final: true,
  });
}

export async function getBalance(
  targetAddress: string,
  client: IClient,
  account: IAccount,
): Promise<bigint> {
  const args = new Args().addString(account.address()).serialize();
  const data = await readSC(client, 'balanceOf', targetAddress, args);
  return bytesToU256(data);
}
