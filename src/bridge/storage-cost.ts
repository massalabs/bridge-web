import { STORAGE_BYTE_COST, strToBytes } from '@massalabs/massa-web3';
import { config } from '@/const';
import {
  useAccountStore,
  useBridgeModeStore,
  useTokenStore,
} from '@/store/store';

export function increaseAllowanceStorageCost(): bigint {
  const { massaClient, connectedAccount, addrInfo } =
    useAccountStore.getState();
  const { selectedToken } = useTokenStore.getState();
  const { currentMode } = useBridgeModeStore.getState();

  if (!massaClient) return 0n;
  if (!selectedToken) return 0n;
  if (!connectedAccount) return 0n;

  const allKeys = addrInfo[0].candidate_datastore_keys;
  const key = allowanceKey(
    connectedAccount.address(),
    config[currentMode].massaBridgeContract,
  );
  const foundKey = allKeys.find((k) => {
    return JSON.stringify(k) === JSON.stringify(key);
  });
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
