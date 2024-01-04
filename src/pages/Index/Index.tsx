import { useState, SyntheticEvent, useEffect } from 'react';

import { toast } from '@massalabs/react-ui-kit';
import { providers } from '@massalabs/wallet-provider';
import { parseUnits } from 'viem';
import {
  useAccount,
  useNetwork,
  useWaitForTransaction,
  useToken,
  useContractEvent,
} from 'wagmi';

import { BridgeRedeemLayout } from './Layouts/BridgeRedeemLayout/BridgeRedeemLayout';
import { LoadingLayout } from './Layouts/LoadingLayout/LoadingLayout';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { TokensFAQ } from '@/components/FAQ/TokensFAQ';
import {
  LayoutType,
  ILoadingState,
  MASSA_STATION,
  EVM_BRIDGE_ADDRESS,
} from '@/const';
import { BRIDGE_OFF, REDEEM_OFF } from '@/const/env/maintenance';
import { handleApproveBridge } from '@/custom/bridge/handlers/handleApproveBridge';
import { handleApproveRedeem } from '@/custom/bridge/handlers/handleApproveRedeem';
import { handleBurnRedeem } from '@/custom/bridge/handlers/handleBurnRedeem';
import { handleLockBridge } from '@/custom/bridge/handlers/handleLockBridge';
import { handleMintBridge } from '@/custom/bridge/handlers/handleMintBridge';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
import Intl from '@/i18n/i18n';
import { useAccountStore, useNetworkStore } from '@/store/store';
import { EVM_TO_MASSA, MASSA_TO_EVM } from '@/utils/const';

export function Index() {
  const [
    getAccounts,
    getTokens,
    massaClient,
    connectedAccount,
    token,
    isFetching,
    setStationInstalled,
    isStationInstalled,
    startRefetch,
    providersFetched,
    loadAccounts,
  ] = useAccountStore((state) => [
    state.getAccounts,
    state.getTokens,
    state.massaClient,
    state.connectedAccount,
    state.token,
    state.isFetching,
    state.setStationInstalled,
    state.isStationInstalled,
    state.startRefetch,
    state.providersFetched,
    state.loadAccounts,
  ]);

  const [currentNetwork] = useNetworkStore((state) => [state.currentNetwork]);

  const { chain, chains } = useNetwork();

  const { isConnected: isEvmWalletConnected, address: evmAddress } =
    useAccount();

  const {
    handleApprove: _handleApproveEVM,
    handleLock: _handleLockEVM,
    handleRedeem: _handleRedeemEVM,
    allowance: _allowanceEVM,
    tokenBalance: _tokenBalanceEVM,
    hashLock: _hashLockEVM,
    hashApprove: _hashApproveEVM,
  } = useEvmBridge();

  const {
    data: lockData,
    isSuccess: lockIsSuccess,
    isError: lockIsError,
  } = useWaitForTransaction({ hash: _hashLockEVM });

  const { isSuccess: approveIsSuccess, isError: approveIsError } =
    useWaitForTransaction({ hash: _hashApproveEVM });

  const evmToken = token?.evmToken as `0x${string}`;
  const { data: tokenData } = useToken({ address: evmToken });

  const [_interval, _setInterval] = useState<NodeJS.Timeout>();
  const [amount, setAmount] = useState<string | undefined>('');
  const [layout, setLayout] = useState<LayoutType | undefined>(EVM_TO_MASSA);
  const [error, setError] = useState<{ amount: string } | null>(null);
  const [burnTxID, setBurnTxID] = useState<string | undefined>(undefined);
  const [lockTxID, setLockTxID] = useState<string | undefined>(undefined);
  const [redeemSteps, setRedeemSteps] = useState<string>(
    Intl.t('index.loading-box.burn'),
  );
  const [isRedeem, setIsRedeem] = useState<boolean>(false);
  const [loading, _setLoading] = useState<ILoadingState>({
    box: 'none',
    approve: 'none',
    burn: 'none',
    claim: 'none',
    lock: 'none',
    mint: 'none',
    error: 'none',
  });
  const [decimals, setDecimals] = useState<number>(tokenData?.decimals || 18);

  const SEPOLIA_CHAIN_ID = chains
    .filter((c: { network: string }) => c.network === 'sepolia')
    .at(0)?.id;

  const IS_MASSA_TO_EVM = layout === MASSA_TO_EVM;

  const IS_EVM_SEPOLIA_CHAIN = chain?.id === SEPOLIA_CHAIN_ID;

  const IS_NOT_BUILDNET = currentNetwork
    ? currentNetwork !== 'buildnet'
    : false;

  const isLoading = loading.box !== 'none' ? true : false;
  const isBlurred = loading.box !== 'none' ? 'blur-md' : '';
  let operationId = IS_MASSA_TO_EVM ? burnTxID : lockTxID;
  let isButtonDisabled =
    isFetching ||
    !isStationInstalled ||
    !isEvmWalletConnected ||
    !IS_EVM_SEPOLIA_CHAIN ||
    IS_NOT_BUILDNET ||
    (BRIDGE_OFF && !IS_MASSA_TO_EVM) ||
    (REDEEM_OFF && IS_MASSA_TO_EVM);

  useEffect(() => {
    if (isRedeem) {
      setLoading({ box: 'success', claim: 'success' });
    }
  }, [isRedeem]);

  const redeemEventHandler = useContractEvent({
    address: EVM_BRIDGE_ADDRESS,
    abi: bridgeVaultAbi,
    eventName: 'Redeemed',
    listener() {
      setIsRedeem(true);
      redeemEventHandler?.();
    },
  });

  useEffect(() => {
    setError({ amount: '' });
    setDecimals(tokenData?.decimals || 18);
  }, [amount, layout, token?.name, tokenData?.decimals]);

  useEffect(() => {
    if ((!IS_EVM_SEPOLIA_CHAIN && isEvmWalletConnected) || IS_NOT_BUILDNET) {
      toast.error(Intl.t('connect-wallet.wrong-chain'));
      return;
    }
  }, [chain, currentNetwork]);

  useEffect(() => {
    setAmount('');
  }, [layout, token?.name]);

  useEffect(() => {
    if (lockIsSuccess) {
      setLoading({ lock: 'success' });
      let data = lockData;
      setLockTxID(data?.transactionHash);
    }
    if (lockIsError) {
      setLoading({ box: 'error', lock: 'error' });
    }
  }, [lockIsSuccess, lockIsError]);

  useEffect(() => {
    if (!massaClient) return;
    if (lockTxID) {
      const mintArgs = {
        massaClient,
        massaOperationID: lockTxID,
        setLoading,
        getTokens,
      };
      handleMintBridge({ ...mintArgs });
    }
  }, [lockTxID]);

  useEffect(() => {
    if (approveIsSuccess) {
      setLoading({ approve: 'success' });
      if (!amount) return;
      const lockArgs = {
        setLoading,
        amount,
        _handleLockEVM,
        decimals,
      };
      handleLockBridge(lockArgs);
    }
    if (approveIsError) {
      setLoading({ box: 'error', approve: 'error' });
      toast.error(Intl.t('index.approve.error.failed'));
    }
  }, [approveIsSuccess, approveIsError]);

  useEffect(() => {
    if (providersFetched.length > 0) {
      loadAccounts(providersFetched);

      providersFetched.some((provider: { name: () => string }) => {
        provider.name() === MASSA_STATION && setStationInstalled(true);
      });
    } else {
      setStationInstalled(false);
    }
  }, [providersFetched]);

  useEffect(() => {
    getAccounts();
    getProviderList();
    startRefetch();
  }, []);

  useEffect(() => {
    getTokens();
  }, [connectedAccount]);

  useEffect(() => {
    if (loading.box === 'none') closeLoadingBox();
  }, [loading.box]);

  async function getProviderList() {
    const providerList = await providers();
    const massaStationWallet = providerList.some(
      (provider: { name: () => string }) => provider.name() === MASSA_STATION,
    );
    setStationInstalled(!!massaStationWallet);
  }

  function handleToggleLayout() {
    setLayout(IS_MASSA_TO_EVM ? EVM_TO_MASSA : MASSA_TO_EVM);
  }

  function validate() {
    setError(null);

    if (!amount) {
      setError({ amount: Intl.t('index.approve.error.invalid-amount') });
      return false;
    }

    let _amount;
    let _balance;

    if (IS_MASSA_TO_EVM) {
      if (!token) {
        return false;
      }
      _amount = parseUnits(amount, decimals);
      _balance = token.balance;
    } else {
      _amount = parseUnits(amount, decimals);
      _balance = _tokenBalanceEVM;
    }

    if (_amount <= 0n) {
      setError({ amount: Intl.t('index.approve.error.invalid-amount') });
      return false;
    }

    if (_balance < _amount) {
      setError({ amount: Intl.t('index.approve.error.insufficient-funds') });
      return false;
    }

    return true;
  }

  // TODO: refactor this
  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading({
      box: 'loading',
    });

    if (IS_MASSA_TO_EVM) {
      if (!massaClient || !token || !amount) {
        return;
      }
      const approved = await handleApproveRedeem(
        massaClient,
        setLoading,
        token,
        amount,
        decimals,
      );

      if (approved) {
        if (!token || !evmAddress || !amount) {
          return;
        }

        const burnArgs = {
          client: massaClient,
          token,
          evmAddress,
          amount,
          decimals,
          setBurnTxID,
          setLoading,
          setRedeemSteps,
        };

        await handleBurnRedeem(burnArgs);
      }
    } else {
      if (!amount) {
        return;
      }
      const approved = await handleApproveBridge(
        setLoading,
        amount,
        decimals,
        _handleApproveEVM,
        _allowanceEVM,
      );

      if (approved) {
        const lockArgs = {
          setLoading,
          amount,
          _handleLockEVM,
          decimals,
        };
        await handleLockBridge(lockArgs);
      }
    }
  }

  function setLoading(state: ILoadingState) {
    _setLoading((prevState) => {
      return { ...prevState, ...state };
    });
  }

  function closeLoadingBox() {
    setLoading({
      box: 'none',
      approve: 'none',
      burn: 'none',
      redeem: 'none',
      lock: 'none',
      mint: 'none',
      error: 'none',
    });
    setAmount('');
    // the lockTxID & burnTdID is not reset after mint/claim
    setLockTxID(undefined);
    setBurnTxID(undefined);
  }

  return (
    <>
      {/* If loading -> show loading layout else show home page*/}
      {isLoading ? (
        <LoadingLayout
          onClose={closeLoadingBox}
          loading={loading}
          setLoading={setLoading}
          massaToEvm={IS_MASSA_TO_EVM}
          amount={amount ?? '0'}
          redeemSteps={redeemSteps}
          operationId={operationId}
          decimals={decimals}
        />
      ) : (
        <BridgeRedeemLayout
          isBlurred={isBlurred}
          IS_MASSA_TO_EVM={IS_MASSA_TO_EVM}
          isButtonDisabled={isButtonDisabled}
          layout={layout}
          amount={amount}
          error={error}
          decimals={decimals}
          setAmount={setAmount}
          setError={setError}
          handleSubmit={handleSubmit}
          handleToggleLayout={handleToggleLayout}
        />
      )}
      {!isLoading && <TokensFAQ />}
    </>
  );
}
