import { STORAGE_BYTE_COST, strToBytes } from '@massalabs/massa-web3';
import { config } from '@/const';
import {
  useAccountStore,
  useBridgeModeStore,
  useTokenStore,
} from '@/store/store';

export async function increaseAllowanceStorageCost(): Promise<bigint> {
  const { massaClient, connectedAccount } = useAccountStore.getState();
  const { selectedToken } = useTokenStore.getState();
  const { currentMode } = useBridgeModeStore.getState();

  if (!massaClient) return 0n;
  if (!selectedToken) return 0n;
  if (!connectedAccount) return 0n;

  const addrInfo = await massaClient
    .publicApi()
    .getAddresses([selectedToken.massaToken]);
  const allKeys = addrInfo[0].candidate_datastore_keys;
  const key = allowanceKey(
    connectedAccount.address(),
    config[currentMode].massaBridgeContract,
  );
  const foundKey = allKeys.find((k) => k === key);

  if (foundKey) {
    return 0n;
  }

  const storage =
    4n +
    9n +
    BigInt(connectedAccount.address().length) +
    BigInt(config[currentMode].massaBridgeContract.length) +
    32n;

  return STORAGE_BYTE_COST * storage;
}

// from massa-standards/smart-contracts/assembly/contracts/FT/token-internals.ts

export const ALLOWANCE_KEY_PREFIX = 'ALLOWANCE';

function allowanceKey(owner: string, spender: string): number[] {
  return Array.from(strToBytes(ALLOWANCE_KEY_PREFIX + owner.concat(spender)));
}
