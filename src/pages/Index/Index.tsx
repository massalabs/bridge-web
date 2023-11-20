import { useState, SyntheticEvent, useEffect, useRef } from 'react';

import { Client } from '@massalabs/massa-web3';
import { Button, toast, Money } from '@massalabs/react-ui-kit';
import { providers } from '@massalabs/wallet-provider';
import { Big } from 'big.js';
import { FiRepeat } from 'react-icons/fi';
import { parseUnits, Log as IEventLog } from 'viem';
import {
  useAccount,
  useNetwork,
  useWaitForTransaction,
  useToken,
  useContractEvent,
} from 'wagmi';

import { boxLayout } from './boxLayout/boxLayout';
import { LoadingBox } from './Loading';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { GetTokensPopUpModal } from '@/components';
import { TokensFAQ } from '@/components/FAQ/TokensFAQ';
import {
  LayoutType,
  ILoadingState,
  MASSA_STATION,
  EVM_BRIDGE_ADDRESS,
} from '@/const';
import { BRIDGE_OFF, REDEEM_OFF } from '@/const/env/maintenance';
import { forwardBurn } from '@/custom/bridge/bridge';
import { handleApproveEVM } from '@/custom/bridge/handlers/handleApproveEvm';
import { handleApproveMASSA } from '@/custom/bridge/handlers/handleApproveMassa';
import {
  ICustomError,
  handleClosePopUp,
  handleErrorMessage,
} from '@/custom/bridge/handlers/handleErrorMessage';
import {
  waitForMintEvent,
  waitIncludedOperation,
} from '@/custom/bridge/massa-utils';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
import { TokenPair } from '@/custom/serializable/tokenPair';
import Intl from '@/i18n/i18n';
import { useAccountStore, useNetworkStore } from '@/store/store';
import { EVM_TO_MASSA, MASSA_TO_EVM } from '@/utils/const';
import { formatAmount } from '@/utils/parseAmount';

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

  const [_interval, _setInterval] = useState<NodeJS.Timeout>();
  const [openTokensModal, setOpenTokensModal] = useState<boolean>(false);
  const [amount, setAmount] = useState<string | undefined>('');
  const [layout, setLayout] = useState<LayoutType | undefined>(EVM_TO_MASSA);
  const [error, setError] = useState<{ amount: string } | null>(null);

  const EVMOperationID = useRef<string | undefined>(undefined);
  const [MassaOperationID, setMassaOperationID] = useState<string | undefined>(
    undefined,
  );

  const [redeemSteps, setRedeemSteps] = useState<string>(
    Intl.t('index.loading-box.burn'),
  );

  const [loading, _setLoading] = useState<ILoadingState>({
    box: 'none',
    approve: 'none',
    burn: 'none',
    redeem: 'none',
    lock: 'none',
    mint: 'none',
    error: 'none',
  });
  function setLoading(state: ILoadingState) {
    _setLoading((prevState) => {
      return { ...prevState, ...state };
    });
  }

  const { chain, chains } = useNetwork();

  const { isConnected: isEvmWalletConnected, address: evmAddress } =
    useAccount();

  const {
    handleApprove: _handleApproveEVM,
    handleLock: _handleLockEVM,
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

  const [decimals, setDecimals] = useState<number>(tokenData?.decimals || 18);

  const IS_MASSA_TO_EVM = layout === MASSA_TO_EVM;

  const SEPOLIA_CHAIN_ID = chains
    .filter((c: { network: string }) => c.network === 'sepolia')
    .at(0)?.id;

  const IS_EVM_SEPOLIA_CHAIN = chain?.id === SEPOLIA_CHAIN_ID;

  const [currentNetwork] = useNetworkStore((state) => [state.currentNetwork]);
  const IS_NOT_BUILDNET = currentNetwork
    ? currentNetwork !== 'buildnet'
    : false;

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
      setMassaOperationID(data?.transactionHash);
    }
    if (lockIsError) {
      setLoading({ box: 'error', lock: 'error', mint: 'error' });
    }
  }, [lockIsSuccess, lockIsError]);

  useEffect(() => {
    if (MassaOperationID) monitorMintMassaEvents();
  }, [MassaOperationID]);

  useEffect(() => {
    if (approveIsSuccess) {
      setLoading({ approve: 'success' });
      handleBridge();
    }
    if (approveIsError) {
      setLoading({
        box: 'error',
        approve: 'error',
        lock: 'error',
        mint: 'error',
      });
    }
  }, [approveIsSuccess, approveIsError]);

  const unwatch = useContractEvent({
    address: EVM_BRIDGE_ADDRESS,
    abi: bridgeVaultAbi,
    eventName: 'Redeemed',
    listener(events) {
      handleRedeemEvent(events);
      unwatch?.();
    },
  });

  async function handleRedeemEvent(events: IEventLog[]) {
    if (!EVMOperationID.current) {
      return;
    }
    const found = events.some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ev) => (ev as any).args.burnOpId === EVMOperationID.current,
    );

    if (found) {
      setLoading({
        box: 'success',
        redeem: 'success',
      });
      EVMOperationID.current = undefined;
      getTokens();
    }
  }

  async function getProviderList() {
    const providerList = await providers();
    const massaStationWallet = providerList.some(
      (provider: { name: () => string }) => provider.name() === MASSA_STATION,
    );
    setStationInstalled(!!massaStationWallet);
  }

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
      setError({ amount: Intl.t('index.approve.error.insuficient-funds') });
      return false;
    }

    return true;
  }

  async function handleBridge() {
    setLoading({ lock: 'loading' });

    try {
      if (!amount) {
        throw new Error('Missing param');
      }

      await _handleLockEVM(parseUnits(amount, decimals));
    } catch (error) {
      setLoading({ box: 'error', lock: 'error', mint: 'error' });

      if (error)
        handleErrorMessage(
          error as Error,
          setLoading,
          setRedeemSteps,
          setAmount,
        );

      return false;
    }

    return true;
  }

  async function handleRedeem(client: Client) {
    try {
      if (!token || !evmAddress || !amount) {
        throw new Error('Missing param');
      }

      const tokenPairs = new TokenPair(
        token.massaToken,
        token.evmToken,
        token.chainId,
      );

      setLoading({
        burn: 'loading',
      });
      setRedeemSteps(Intl.t('index.loading-box.awaiting-inclusion'));

      const operationId = await forwardBurn(
        client,
        evmAddress,
        tokenPairs,
        parseUnits(amount, decimals),
      );
      EVMOperationID.current = operationId;

      setRedeemSteps(Intl.t('index.loading-box.included-pending'));

      await waitIncludedOperation(client, operationId, true);

      setLoading({
        burn: 'success',
        redeem: 'loading',
      });
      setRedeemSteps(Intl.t('index.loading-box.burned-final'));
    } catch (error) {
      console.error(error);

      if (error)
        handleErrorMessage(
          error as Error,
          setLoading,
          setRedeemSteps,
          setAmount,
        );

      return false;
    }

    return true;
  }

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading({
      box: 'loading',
    });

    if (IS_MASSA_TO_EVM) {
      if (!massaClient) {
        return;
      }
      const approved = await handleApproveMASSA(
        massaClient,
        setLoading,
        setRedeemSteps,
        setAmount,
        token,
        amount,
        decimals,
      );

      if (approved) {
        await handleRedeem(massaClient);
      }
    } else {
      const approved = await handleApproveEVM(
        setLoading,
        setRedeemSteps,
        setAmount,
        amount,
        decimals,
        _handleApproveEVM,
        _allowanceEVM,
      );

      if (approved) {
        await handleBridge();
      }
    }
  }

  function handlePercent(percent: number) {
    if (!token) return;

    if (
      (IS_MASSA_TO_EVM && token.balance <= 0) ||
      (!IS_MASSA_TO_EVM && _tokenBalanceEVM <= 0)
    ) {
      setError({ amount: Intl.t('index.approve.error.insuficient-funds') });
      return;
    }

    const amount = IS_MASSA_TO_EVM
      ? formatAmount(token?.balance.toString(), decimals, '').full
      : formatAmount(_tokenBalanceEVM.toString(), decimals, '').full;

    const x = new Big(amount);
    const y = new Big(percent);
    const res = x.times(y).round(decimals).toFixed();

    setAmount(res);
  }

  async function monitorMintMassaEvents() {
    if (!massaClient || !MassaOperationID) return;

    setLoading({
      mint: 'loading',
    });

    try {
      const success = await waitForMintEvent(massaClient, MassaOperationID);

      if (success) {
        setLoading({
          box: 'success',
          mint: 'success',
        });
        getTokens();
      } else {
        setLoading({
          box: 'error',
          mint: 'error',
          error: 'error',
        });
      }
    } catch (error) {
      console.error(error);
      const cause = (error as ICustomError)?.cause;
      const isTimeout = cause?.error === 'timeout';

      if (isTimeout) {
        setLoading({
          box: 'warning',
          mint: 'warning',
        });
      } else {
        setLoading({
          box: 'error',
          mint: 'error',
          error: 'error',
        });
      }
    }
  }

  useEffect(() => {
    if (loading.box === 'none') handleClosePopUp(setLoading, setAmount);
  }, [loading.box]);

  const isLoading = loading.box !== 'none' ? 'blur-md' : null;
  const operationId = IS_MASSA_TO_EVM
    ? EVMOperationID.current
    : MassaOperationID;

  // testing functions

  return (
    <>
      {isLoading && (
        <LoadingBox
          onClose={() => handleClosePopUp(setLoading, setAmount)}
          loading={loading}
          massaToEvm={IS_MASSA_TO_EVM}
          amount={amount ?? '0'}
          redeemSteps={redeemSteps}
          token={token}
          operationId={operationId}
        />
      )}
      <div
        className={`p-10 max-w-2xl w-full border border-tertiary rounded-2xl
            bg-secondary/50 backdrop-blur-lg text-f-primary mb-5 ${isLoading}`}
      >
        <div className="p-6 bg-primary rounded-2xl mb-5">
          <p className="mb-4 mas-body">{Intl.t(`index.from`)}</p>
          {boxLayout(layout).up.header}
          {boxLayout(layout).up.wallet}
          <div className="mb-4 flex items-center gap-2">
            <div className="w-full">
              <Money
                disable={isFetching}
                name="amount"
                value={amount}
                onValueChange={(o) => setAmount(o.value)}
                placeholder={Intl.t(`index.input.placeholder.amount`)}
                suffix=""
                decimalScale={decimals}
                error={error?.amount}
              />
              <div className="flex flex-row-reverse">
                <ul className="flex flex-row mas-body2">
                  <li
                    onClick={() => handlePercent(0.25)}
                    className="mr-3.5 hover:cursor-pointer"
                  >
                    25%
                  </li>
                  <li
                    onClick={() => handlePercent(0.5)}
                    className="mr-3.5 hover:cursor-pointer"
                  >
                    50%
                  </li>
                  <li
                    onClick={() => handlePercent(0.75)}
                    className="mr-3.5 hover:cursor-pointer"
                  >
                    75%
                  </li>
                  <li
                    onClick={() => handlePercent(1)}
                    className="mr-3.5 hover:cursor-pointer"
                  >
                    Max
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-1/3 mb-4">{boxLayout(layout).up.token}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {isEvmWalletConnected && (
                <h3
                  className="mas-h3 text-f-disabled-1 underline cursor-pointer"
                  onClick={() => setOpenTokensModal(true)}
                >
                  {Intl.t(`index.get-tokens`)}
                </h3>
              )}
            </div>
            {boxLayout(layout).up.balance}
          </div>
        </div>
        <div className="mb-5 flex justify-center items-center">
          <Button
            disabled={isFetching}
            variant="toggle"
            onClick={handleToggleLayout}
            customClass={`w-12 h-12 inline-block transition ease-in-out delay-10 ${
              IS_MASSA_TO_EVM ? 'rotate-180' : ''
            }`}
          >
            <FiRepeat size={24} />
          </Button>
        </div>
        <div className="mb-5 p-6 bg-primary rounded-2xl">
          <p className="mb-4 mas-body">{Intl.t(`index.to`)}</p>
          {boxLayout(layout).down.header}
          {boxLayout(layout).down.wallet}
          <div className="mb-4 flex items-center gap-2">
            <div className="w-full">
              <Money
                placeholder={Intl.t(`index.input.placeholder.receive`)}
                name="receive"
                value={amount}
                onValueChange={(o) => setAmount(o.value)}
                suffix=""
                decimalScale={decimals}
                error=""
                disable={true}
              />
            </div>
            <div className="w-1/3">{boxLayout(layout).down.token}</div>
          </div>
          <div className="flex justify-between items-center">
            <br />
            {boxLayout(layout).down.balance}
          </div>
        </div>
        <div>
          <Button
            disabled={
              isFetching ||
              !isStationInstalled ||
              !isEvmWalletConnected ||
              !IS_EVM_SEPOLIA_CHAIN ||
              IS_NOT_BUILDNET ||
              (BRIDGE_OFF && !IS_MASSA_TO_EVM) ||
              (REDEEM_OFF && IS_MASSA_TO_EVM)
            }
            onClick={(e) => handleSubmit(e)}
          >
            {IS_MASSA_TO_EVM
              ? Intl.t(`index.button.redeem`)
              : Intl.t(`index.button.bridge`)}
          </Button>
        </div>
      </div>
      {openTokensModal && (
        <GetTokensPopUpModal
          setOpenModal={setOpenTokensModal}
          layout={layout}
        />
      )}
      {!isLoading && <TokensFAQ />}
    </>
  );
}
