import { useEffect } from 'react';

import { Button } from '@massalabs/react-ui-kit';
import { parseUnits } from 'viem';
import { useAccount, useContractEvent } from 'wagmi';

import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { EVM_BRIDGE_ADDRESS } from '@/const';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
import { useAccountStore, useNetworkStore } from '@/store/store';
import {
  RedeemOperationToClaim,
  checkIfUserHasTokensToClaim,
} from '@/utils/lambdaApi';

// TODO: add token name -> will come from api

export function Claim() {
  const [connectedAccount] = useAccountStore((state) => [
    state.connectedAccount,
  ]);
  const [burnedOpList, setBurnedOpList] = useNetworkStore((state) => [
    state.burnedOpList,
    state.setBurnedOpList,
  ]);
  const { handleRedeem } = useEvmBridge();
  const { address: evmAddress } = useAccount();
  const massaAddress = connectedAccount?.address();

  useEffect(() => {
    getApiInfo();
  }, []);

  async function getApiInfo() {
    if (!massaAddress || !evmAddress) return;

    const pendingOperations = await checkIfUserHasTokensToClaim(
      massaAddress,
      evmAddress,
    );
    setBurnedOpList(pendingOperations);
  }

  async function _handleRedeem(
    amount: string,
    recipient: `0x${string}`,
    inputOpId: string,
    signatures: string[],
  ) {
    // decimals is set to zero because api reponses with correct amount already
    const redeem = await handleRedeem(
      parseUnits(amount, 0),
      recipient,
      inputOpId,
      signatures,
    );
    if (redeem) {
      // TODO: setLoading state to pending
      console.log('signed in metamask');
    } else {
      // TODO: show error on processingOperation component
      console.log('redeem failed');
    }
  }

  const pollingInterval = 1000;

  // trigger after redeem event
  function pollApiForChanges() {
    setInterval(() => {
      getApiInfo();
    }, pollingInterval);
  }

  const redeemEventHandler = useContractEvent({
    address: EVM_BRIDGE_ADDRESS,
    abi: bridgeVaultAbi,
    eventName: 'Redeemed',
    listener() {
      pollApiForChanges();
      redeemEventHandler?.();
    },
  });

  const burnListIsNotEmpty = burnedOpList && burnedOpList.length > 0;

  return (
    <div className="w-full h-[60vh]">
      {burnListIsNotEmpty ? (
        burnedOpList.map((operation: RedeemOperationToClaim) => {
          const { amount, recipient, inputOpId, signatures } = operation;
          return (
            <div
              key={operation.inputOpId}
              className="flex w-full justify-evenly items-center"
            >
              <p className="text-info">{operation.amount.toString()}</p>
              <div>
                <Button
                  onClick={() =>
                    _handleRedeem(amount, recipient, inputOpId, signatures)
                  }
                >
                  Claim
                </Button>
              </div>
            </div>
          );
        })
      ) : (
        <p className="bg-red-500">no operations</p>
      )}
    </div>
  );
}
