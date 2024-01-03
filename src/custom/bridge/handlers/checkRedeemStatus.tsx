import axios from 'axios';

interface ClaimRedeemResponse {
  evmAddress: `0x${string}` | undefined;
  massaAddress: string | undefined;
  operationId: string | undefined;
}
const lambdaURL = import.meta.env.VITE_LAMBDA_URL;

export async function checkRedeemStatus({
  ...args
}: ClaimRedeemResponse): Promise<any[]> {
  // once burn is successfull -> wait for certian conditions (lambda)
  // TODO: polling fn to check for signatures

  const { evmAddress, massaAddress } = args;

  let signatures: any[] = [];

  try {
    const response = await axios.get(lambdaURL!, {
      params: {
        evmAddress,
        massaAddress,
      },
    });

    const isResponseArray = Array.isArray(response.data);
    const filteredResults = response.data.burned.filter(
      (item: any) => item.outputTxId === 'null',
      // && state === processing
    );

    // conditions: state processing, outputTxId = null, burnId = txHash
    // show claim button

    if (isResponseArray && filteredResults.length > 0) {
      signatures = filteredResults.map((item: any) => item.signature);
    }
  } catch (error) {
    console.error('Error fetching resource:', error);
    return [];
  }
  return signatures;
}
