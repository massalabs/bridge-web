import {
  Client,
  ProviderType,
  PublicApiClient,
  strToBytes,
} from '@massalabs/massa-web3';
import { allowanceKeysExist } from '../../src/bridge/storage-cost';

const OWNER = 'AU12pbCsF4e6A31K8jQTGAez5eLs3Q4ANeMzYrP91jJ7Vw3d6uaiR';
const SPENDER = 'AS1owaJB7NkqY2pjsggBP7m1jFA9XRZKGpXBbjBMeysQDSxjm7MS';
const APPROVED_TOKEN = 'AS1gt69gqYD92dqPyE6DBRJ7KjpnQHqFzFs2YCkBcSnuxX5bGhBC';
const UNAPPROVED_TOKEN =
  'AS12LKs9txoSSy8JgFJgV96m8k5z9pgzjYMYSshwN67mFVuj3bdUV';

// a u256 allowance, as stored by the token contract
const allowanceValue = (amount: number) => {
  const value = new Array(32).fill(0);
  value[0] = amount;
  return value;
};

// The real massa-web3 public client, with only the node request stubbed:
// the node answers null for a missing key, as get_datastore_entries does.
const clientWithNode = (values: Record<string, number[] | null>) => {
  const publicApi = new PublicApiClient({
    providers: [{ url: 'http://node', type: ProviderType.PUBLIC }],
    retryStrategyOn: false,
  });
  const sendJsonRPCRequest = jest.fn(
    async (_method: string, [inputs]: [{ address: string }[]]) =>
      inputs.map(({ address }) => ({
        final_value: values[address],
        candidate_value: values[address],
      })),
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (publicApi as any).sendJsonRPCRequest = sendJsonRPCRequest;
  const client = { publicApi: () => publicApi } as unknown as Client;
  return { client, sendJsonRPCRequest };
};

describe('allowanceKeysExist', () => {
  it('tells which tokens hold an allowance entry for the spender', async () => {
    const { client } = clientWithNode({
      [APPROVED_TOKEN]: allowanceValue(5),
      [UNAPPROVED_TOKEN]: null,
    });

    const exist = await allowanceKeysExist(
      client,
      [APPROVED_TOKEN, UNAPPROVED_TOKEN],
      OWNER,
      SPENDER,
    );

    expect(exist).toEqual([true, false]);
  });

  it('counts an entry holding a 0 allowance as existing', async () => {
    const { client } = clientWithNode({ [APPROVED_TOKEN]: allowanceValue(0) });

    const exist = await allowanceKeysExist(
      client,
      [APPROVED_TOKEN],
      OWNER,
      SPENDER,
    );

    expect(exist).toEqual([true]);
  });

  it('reads the exact allowance key of each token in one request', async () => {
    const { client, sendJsonRPCRequest } = clientWithNode({
      [APPROVED_TOKEN]: null,
      [UNAPPROVED_TOKEN]: null,
    });

    await allowanceKeysExist(
      client,
      [APPROVED_TOKEN, UNAPPROVED_TOKEN],
      OWNER,
      SPENDER,
    );

    expect(sendJsonRPCRequest).toHaveBeenCalledTimes(1);
    const [method, [inputs]] = sendJsonRPCRequest.mock.calls[0];
    expect(method).toEqual('get_datastore_entries');
    const key = Array.from(strToBytes('ALLOWANCE' + OWNER + SPENDER));
    expect(inputs).toEqual([
      { address: APPROVED_TOKEN, key },
      { address: UNAPPROVED_TOKEN, key },
    ]);
  });

  it('does not query the node without tokens', async () => {
    const { client, sendJsonRPCRequest } = clientWithNode({});

    expect(await allowanceKeysExist(client, [], OWNER, SPENDER)).toEqual([]);
    expect(sendJsonRPCRequest).not.toHaveBeenCalled();
  });
});
