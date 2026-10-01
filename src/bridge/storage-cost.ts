import { Client, STORAGE_BYTE_COST, strToBytes } from '@massalabs/massa-web3';
import { config } from '@/const';
import {
  useAccountStore,
  useBridgeModeStore,
  useTokenStore,
} from '@/store/store';

/**
 * Storage cost of the allowance entry that increaseAllowance creates when the connected account has
 * never given an allowance to the bridge on the selected token.
 */
export function increaseAllowanceStorageCost(): bigint {
  const { connectedAccount } = useAccountStore.getState();
  const { selectedToken } = useTokenStore.getState();
  const { currentMode } = useBridgeModeStore.getState();

  if (!selectedToken) return 0n;
  if (!connectedAccount) return 0n;
  if (selectedToken.hasAllowanceKey) return 0n;

  const storage =
    4n +
    9n +
    BigInt(connectedAccount.address().length) +
    BigInt(config[currentMode].massaBridgeContract.length) +
    32n;

  return STORAGE_BYTE_COST * storage;
}

/**
 * Tells, for each token, whether the owner already has an allowance entry for the spender.
 * Reads the exact datastore keys, in one request, instead of listing the keys of the token contracts:
 * a token holds one entry per holder, and a node may cap how many keys it lists.
 * @param client - The client to use
 * @param tokens - The token contract addresses
 * @param owner - The address giving the allowance
 * @param spender - The address receiving the allowance
 * @returns Whether the allowance entry exists, in the order of `tokens`
 */
export async function allowanceKeysExist(
  client: Client,
  tokens: string[],
  owner: string,
  spender: string,
): Promise<boolean[]> {
  if (!tokens.length) return [];

  const key = Uint8Array.from(allowanceKey(owner, spender));
  const entries = await client
    .publicApi()
    .getDatastoreEntries(tokens.map((address) => ({ address, key })));

  // massa-web3 types a missing value as null, but turns it into an empty array.
  // An allowance entry is never empty: it holds a u256, even for a 0 allowance.
  return entries.map((entry) => !!entry.candidate_value?.length);
}

// from massa-standards/smart-contracts/assembly/contracts/FT/token-internals.ts

export const ALLOWANCE_KEY_PREFIX = 'ALLOWANCE';

function allowanceKey(owner: string, spender: string): number[] {
  return Array.from(strToBytes(ALLOWANCE_KEY_PREFIX + owner.concat(spender)));
}
