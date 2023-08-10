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
  U256_MAX,
  EVM_BRIDGE_ADDRESS,
} from '@/const';
import { forwardBurn, increaseAllowance } from '@/custom/bridge/bridge';
import {
  waitForMintEvent,
  waitIncludedOperation,
} from '@/custom/bridge/massa-utils';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
import { TokenPair } from '@/custom/serializable/tokenPair';
import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';
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

  const burnMassaOperation = useRef<string | undefined>();
  const [bridgeMassaOperation, setBridgeMassaOperation] = useState<
    string | undefined
  >('');
  const [redeemSteps, setRedeemSteps] = useState<string>(
    Intl.t('index.loading-box.burn'),
  );

  const [loading, _setLoading] = useState<ILoadingState>({
    box: 'none',
    bridge: 'none',
    approve: 'none',
    burn: 'none',
    redeem: 'none',
    lock: 'none',
    mint: 'none',
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

  useEffect(() => {
    setError({ amount: '' });
    setDecimals(tokenData?.decimals || 18);
  }, [amount, layout, token?.name, tokenData?.decimals]);

  useEffect(() => {
    if (!IS_EVM_SEPOLIA_CHAIN && isEvmWalletConnected) {
      toast.error(Intl.t('connect-wallet.connect-metamask.wrong-chain'));
    }
  }, [chain]);

  useEffect(() => {
    setAmount('');
  }, [layout, token?.name]);

  useEffect(() => {
    if (lockIsSuccess) {
      setLoading({ lock: 'success' });
      let data = lockData;
      setBridgeMassaOperation(data?.transactionHash);
    }
    if (lockIsError) {
      setLoading({ box: 'error', lock: 'error', mint: 'error' });
    }
  }, [lockIsSuccess, lockIsError]);

  useEffect(() => {
    if (bridgeMassaOperation) monitorMintMassaEvents();
  }, [bridgeMassaOperation]);

  useEffect(() => {
    if (approveIsSuccess) {
      setLoading({ approve: 'success' });
      handleBridgeEVM();
    }
    if (approveIsError) {
      setLoading({
        box: 'error',
        approve: 'error',
        lock: 'error',
        mint: 'error',
      });
      toast.error(Intl.t(`index.bridge.error.general`));
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

  async function handleApproveEVM() {
    try {
      setLoading({ approve: 'loading' });

      if (!amount) {
        return false;
      }

      let _amount = parseUnits(amount, decimals);

      if (_allowanceEVM < _amount) {
        await _handleApproveEVM();
        return false;
      }

      setLoading({ approve: 'success' });
    } catch (error) {
      setLoading({
        box: 'error',
        approve: 'error',
        lock: 'error',
        mint: 'error',
      });

      if (error) handleErrorMessage(error.toString());

      return false;
    }

    return true;
  }

  async function handleBridgeEVM() {
    setLoading({ lock: 'loading' });

    try {
      if (!amount) {
        throw new Error('Amount is not defined');
      }
      await _handleLockEVM(parseUnits(amount, decimals));
    } catch (error) {
      setLoading({ box: 'error', lock: 'error', mint: 'error' });

      if (error) handleErrorMessage(error.toString());

      return false;
    }

    return true;
  }

  async function handleApproveMASSA(client: Client) {
    setLoading({
      approve: 'loading',
    });
    try {
      if (!token) {
        throw new Error('Token is not defined');
      }
      if (!amount) {
        throw new Error('Amount is not defined');
      }

      let _amount = parseUnits(amount, decimals);

      if (token.allowance < _amount) {
        await increaseAllowance(client, token.massaToken, U256_MAX);
      }

      setLoading({
        approve: 'success',
      });
    } catch (error) {
      setLoading({
        box: 'error',
        approve: 'error',
        burn: 'error',
        redeem: 'error',
      });

      if (error) handleErrorMessage(error.toString());
      return false;
    }

    return true;
  }

  async function handleRedeemEvent(events: IEventLog[]) {
    if (!burnMassaOperation.current) {
      return;
    }
    const found = events.some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ev) => (ev as any).args.burnOpId === burnMassaOperation.current,
    );

    if (found) {
      setLoading({
        box: 'success',
        redeem: 'success',
      });
      toast.success(Intl.t(`index.bridge.success`));
      burnMassaOperation.current = undefined;
    }
  }

  async function handleBridgeMASSA(client: Client) {
    try {
      if (!token) {
        throw new Error('Token is not defined');
      }
      if (!evmAddress) {
        throw new Error('Evm address is not defined');
      }
      if (!amount) {
        throw new Error('amount is not defined');
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
      // Start evm event listener
      burnMassaOperation.current = operationId;

      // operation is INCLUDED_PENDING
      setRedeemSteps(Intl.t('index.loading-box.included-pending'));
      await waitIncludedOperation(client, operationId, true);
      // operation is FINAL
      setLoading({
        burn: 'success',
        redeem: 'loading',
      });
      setRedeemSteps(Intl.t('index.loading-box.burned-final'));
    } catch (error) {
      setLoading({
        box: 'error',
        burn: 'error',
        redeem: 'error',
      });

      if (error) handleErrorMessage(error.toString());

      return false;
    }

    return true;
  }

  function handleErrorMessage(error: string) {
    const ERRORS_MESSAGES = [
      'unable to unprotect wallet',
      'TransactionExecutionError: User rejected the request',
    ];

    const regex = new RegExp(ERRORS_MESSAGES.join('|'), 'i');

    if (regex.test(error)) {
      handleClosePopUp();
      return;
    } else {
      toast.error(Intl.t(`index.bridge.error.general`));
    }
  }

  function handleClosePopUp() {
    setLoading({
      box: 'none',
      approve: 'none',
      burn: 'none',
      redeem: 'none',
      lock: 'none',
      mint: 'none',
      bridge: 'none',
    });
    setAmount('');
  }

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (!validate()) return;

    // setLoading({
    //   box: 'loading',
    // });

    console.log(amount);

    // if (IS_MASSA_TO_EVM) {
    //   if (!massaClient) {
    //     return;
    //   }
    //   const approved = await handleApproveMASSA(massaClient);

    //   if (approved) {
    //     await handleBridgeMASSA(massaClient);
    //   }
    // } else {
    //   const approved = await handleApproveEVM();

    //   if (approved) {
    //     await handleBridgeEVM();
    //   }
    // }
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

    const res = x.times(y);

    // TEST
    if (res.toFixed().indexOf('.') === -1) {
      setAmount(res.toFixed());
    } else {
      setAmount(res.toFixed().split('.')[0] + '.' + res.toFixed().split('.')[1].substring(0, decimals));
    }

    // Case when number can be > decimals
    // setAmount(res.toFixed());

    // OLD
    // if (res.toFixed().indexOf('.') === -1) {
    //   setAmount(res.toFixed());
    // } else {
    //   res.toFixed().split('.')[1]  .length > decimals
    //     ? setAmount(res.toFixed(decimals))
    //     : setAmount(res.toString());
    // }
  }

  async function monitorMintMassaEvents() {
    if (!massaClient || !bridgeMassaOperation) {
      return;
    }

    setLoading({
      mint: 'loading',
    });

    try {
      const success = await waitForMintEvent(massaClient, bridgeMassaOperation);

      if (success) {
        setLoading({
          box: 'success',
          mint: 'success',
        });
      } else {
        setLoading({
          box: 'error',
          mint: 'error',
        });
      }
    } catch (error) {
      // timeout error
      setLoading({
        box: 'error',
        mint: 'error',
      });
    }
  }

  useEffect(() => {
    if (loading.box === 'none') handleClosePopUp();
  }, [loading.box]);

  const isLoading = loading.box !== 'none' ? 'blur-md' : null;

  return (
    <>
      {isLoading && (
        <LoadingBox
          onClose={handleClosePopUp}
          loading={loading}
          massaToEvm={IS_MASSA_TO_EVM}
          amount={amount ?? '0'}
          redeemSteps={redeemSteps}
          token={token}
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
                // onValueChange=(value) => setAmount(value)}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={Intl.t(`index.input.placeholder.amount`)}
                suffix=""
                decimalScale={decimals}
                // decimalsLimit={decimals}
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
                // onValueChange={(value) => setAmount(value)}
                onChange={(e) => setAmount(e.target.value)}
                suffix=""
                decimalScale={decimals}
                // decimalsLimit={decimals}
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
              !IS_EVM_SEPOLIA_CHAIN
            }
            onClick={(e) => handleSubmit(e)}
          >
            {Intl.t(`index.button.bridge`)}
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
