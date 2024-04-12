import {
  Args,
  Client,
  IReadData,
  bytesToSerializableObjectArray,
} from '@massalabs/massa-web3';
import { parseUnits } from 'viem';
import { waitIncludedOperation } from './massa-utils';
import {
  useAccountStore,
  useBridgeModeStore,
  useTokenStore,
} from '../../store/store';
import { ForwardingRequest } from '../serializable/request';
import { TokenPair } from '../serializable/tokenPair';
import { increaseAllowanceStorageCost } from '@/bridge/storage-cost';
import { config, forwardBurnFees, increaseAllowanceFee } from '@/const';

export async function increaseAllowance(amount: bigint): Promise<string> {
  const { massaClient } = useAccountStore.getState();
  const { selectedToken } = useTokenStore.getState();
  const { currentMode } = useBridgeModeStore.getState();

  if (!massaClient) throw new Error('Massa client not found');
  if (!selectedToken) throw new Error('Token not selected');

  const opId = await massaClient.smartContracts().callSmartContract({
    targetAddress: selectedToken.massaToken,
    targetFunction: 'increaseAllowance',
    parameter: new Args()
      .addString(config[currentMode].massaBridgeContract)
      .addU256(amount)
      .serialize(),
    fee: increaseAllowanceFee.fee,
    coins: await increaseAllowanceStorageCost(),
  });

  await waitIncludedOperation(opId);

  return opId;
}

export async function forwardBurn(
  recipient: string,
  amount: string,
): Promise<string> {
  const { massaClient } = useAccountStore.getState();
  const { selectedToken } = useTokenStore.getState();
  const { currentMode } = useBridgeModeStore.getState();

  if (!massaClient) throw new Error('Massa client not found');
  if (!selectedToken) throw new Error('Token not selected');

  const amt = parseUnits(amount, selectedToken.decimals);

  const tokenPair = new TokenPair(
    selectedToken.massaToken,
    selectedToken.evmToken,
    selectedToken.chainId,
  );

  const request = new ForwardingRequest(amt, recipient, tokenPair);

  const opId = await massaClient.smartContracts().callSmartContract({
    targetAddress: config[currentMode].massaBridgeContract,
    targetFunction: 'forwardBurn',
    parameter: new Args().addSerializable(request).serialize(),
    ...forwardBurnFees,
  });

  return opId;
}

export async function getSupportedTokensList(
  publicClient: Client,
): Promise<TokenPair[] | undefined> {
  const { currentMode } = useBridgeModeStore.getState();
  const contractAddress = config[currentMode].massaBridgeContract;

  if (!contractAddress) {
    console.warn(
      `Massa Bridge smart contract was not provided for: ${currentMode}`,
    );
    return undefined;
  }

  const returnObject = await publicClient.smartContracts().readSmartContract({
    targetAddress: contractAddress,
    targetFunction: 'supportedTokensList',
    parameter: [],
  } as IReadData);

  return bytesToSerializableObjectArray(returnObject.returnValue, TokenPair);
}
