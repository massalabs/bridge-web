import { useEffect, useState } from 'react';

import { Button } from '@massalabs/react-ui-kit';
import axios from 'axios';
import { parseUnits } from 'viem';
import { useAccount, useNetwork } from 'wagmi';

import { Burned, LambdaResponse, Signatures } from './InterfaceApi';
import { loadingState } from '../LoadingState';
import { ILoadingState } from '@/const';
import { checkBurnedOpForRedeem } from '@/custom/bridge/handlers/checkBurnedOpForRedeem';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';

interface ClaimInterface {
  loading: any;
  redeemSteps: string;
  setLoading: (loading: ILoadingState) => void;
  operationId: string | undefined;
  amount: string;
  decimals: number;
}
// Renders when burn is successful, polls api to see if there is an operation to claim
// If operation found, renders claim button that calls redeem function

export function Claim({
  loading,
  setLoading,
  operationId,
  amount,
  decimals,
}: ClaimInterface) {
  const { address: evmAddress } = useAccount();
  const [connectedAccount, token] = useAccountStore((state) => [
    state.connectedAccount,
    state.token,
  ]);
  const { handleRedeem: _handleRedeemEVM } = useEvmBridge();
  const { chain } = useNetwork();

  const selectedToken = token?.symbol as string;
  const selectedChain = chain?.name as string;

  const [isReadyToClaim, setIsReadyToClaim] = useState(false);
  const [signatures, setSignatures] = useState<string[]>([]);

  const lambdaURL: string = import.meta.env.VITE_LAMBDA_URL;

  const massaAddress = connectedAccount?.address();

  // Polls every 3 seconds to see if conditions are met to show claim
  useEffect(() => {
    if (isReadyToClaim) return;
    if (loading.burn === 'success' && !isReadyToClaim) {
      const timer = setInterval(() => {
        _handleClaimRedeem();
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [loading.burn, isReadyToClaim]);

  async function getBurnedOperationInfo(): Promise<Burned[]> {
    try {
      if (!lambdaURL) return [];
      const response: LambdaResponse = await axios.get(lambdaURL!, {
        params: {
          evmAddress,
          massaAddress,
        },
      });
      return response.data.burned;
    } catch (error) {
      console.error('Error fetching resource:', error);
      return [];
    }
  }

  async function _handleClaimRedeem() {
    const response = await getBurnedOperationInfo();
    const claimArgs = {
      response,
      operationId,
    };

    // Returns signatures sorted by relayerId
    const signatures = await checkBurnedOpForRedeem({ ...claimArgs });

    if (signatures.length > 0) {
      const convertedSignatures: string[] = [];

      signatures.forEach((signature: Signatures) => {
        convertedSignatures.push(signature.signature);
      });

      setSignatures(convertedSignatures);
      setIsReadyToClaim(true);
      setLoading({ claim: 'loading' });
    }
  }

  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col gap-6 w-4/5 items-center ">
        <div className="flex flex-col gap-4 justify-center">
          <p className="flex mas-body-2 text-center">
            {Intl.t('index.loading-box.claim-message', {
              token: selectedToken,
              network: selectedChain,
            })}
          </p>
          <div className="flex w-full justify-between">
            <p className="mas-body-2">{Intl.t('index.loading-box.claim')}</p>
            {loadingState(loading.claim)}
          </div>
        </div>
        {isReadyToClaim && (
          <Button
            onClick={() => {
              _handleRedeemEVM(
                parseUnits(amount, decimals),
                evmAddress as `0x${string}` | undefined,
                operationId,
                signatures,
              );
            }}
          >
            {Intl.t('index.loading-box.claim')}
          </Button>
        )}
      </div>
    </div>
  );
}
