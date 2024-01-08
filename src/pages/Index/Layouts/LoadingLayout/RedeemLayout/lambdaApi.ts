import axios from 'axios';

export interface Locked {
  amount: string;
  evmChainId: number;
  inputTxId: `0x${string}`;
  recipient: string;
  state: string;
  error: {
    msg: string;
    code: number;
    title: string;
  };
  emitter: `0x${string}`;
  outputOpId: string;
}

export interface Burned {
  amount: string;
  outputTxId: `0x${string}` | null;
  ecmChainId: number;
  recipient: `0x${string}`;
  state: string;
  error: null | string;
  emitter: string;
  inputOpId: string;
  signatures: Signatures[];
}

export interface Signatures {
  signature: `0x${string}`;
  relayerId: number;
}

export interface LambdaResponse {
  data: {
    locked: Locked[];
    burned: Burned[];
  };
}

export async function getBurnedOperationInfo(
  evmAddress: `0x${string}`,
  massaAddress: string,
  endPoint: string,
): Promise<Burned[]> {
  const lambdaURL: string = import.meta.env.VITE_LAMBDA_URL;
  try {
    if (!lambdaURL) throw new Error('Api url not found');
    const response: LambdaResponse = await axios.get(lambdaURL + endPoint!, {
      params: {
        evmAddress,
        massaAddress,
      },
    });
    if (!response.data) throw new Error('Api resource not found');
    return response.data.burned;
  } catch (error) {
    console.error('Error fetching resource:', error);
    return [];
  }
}
