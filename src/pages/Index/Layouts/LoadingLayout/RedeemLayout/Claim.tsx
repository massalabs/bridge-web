import { useState } from 'react';

import { Button } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';
import { useAccount, useNetwork } from 'wagmi';

import { loadingState } from '../LoadingState';
import { ILoadingState } from '@/const';
import { checkRedeemStatus } from '@/custom/bridge/handlers/checkRedeemStatus';
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

// When this renders, burn will be successful, but we do not know if all the conditions are met to claim
// We need to wait for these conditions to be met before we can claim
// After these conditions are met, we can show claim button

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
  const [signatures, setSignatures] = useState<any[]>([]);

  // TODO: implement interval to check if claim is successful
  async function _handleClaimRedeem() {
    setLoading({ claim: 'loading' });

    const claimArgs = {
      evmAddress,
      massaAddress: connectedAccount?.address(),
      operationId,
    };
    const signatures = await checkRedeemStatus({ ...claimArgs });

    // Returns signatures that are passed as arguments to _handleRedeemEVM
    if (signatures) {
      setSignatures(signatures);
      setIsReadyToClaim(true);
      //   setLoading({ box: 'success', claim: 'success' });
    } else {
      setLoading({ box: 'error', claim: 'error' });
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
