import axios from 'axios';

interface ClaimRedeemResponse {
  evmAddress: `0x${string}` | undefined;
  massaAddress: string | undefined;
  operationId: string | undefined;
}

export async function handleClaimRedeem({
  ...args
}: ClaimRedeemResponse): Promise<boolean> {
  // TODO: Add logic to determine what operation we are precisely looking for
  // return the parameters that I'm interested in order to initiate redeem
  const { evmAddress, massaAddress } = args;
  const lambdaURL = import.meta.env.VITE_LAMBDA_URL;

  try {
    const response = await axios.get(lambdaURL!, {
      params: {
        evmAddress,
        massaAddress,
      },
    });

    const isResponseArray = Array.isArray(response.data);
    const filteredResults = response.data.burned.filter(
      (item: any) => item.state === 'processing',
    );
    console.log('filteredResults', filteredResults);
    if (isResponseArray && filteredResults.length > 0) {
      return true;
    }
  } catch (error) {
    console.error('Error fetching resource:', error);
    return false;
  }
  return true;
}
