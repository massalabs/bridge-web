import { useEffect, useState } from 'react';

import { fromMAS } from '@massalabs/massa-web3';
import {
  FetchingLine,
  Tag,
  Tooltip,
  formatAmount,
} from '@massalabs/react-ui-kit';
import { IAccountBalanceResponse } from '@massalabs/wallet-provider';

import { FiHelpCircle } from 'react-icons/fi';
import { mainnet } from 'viem/chains';
import { useAccount } from 'wagmi';
import { fetchMASBalance } from '@/bridge';
import { MASSA_TOKEN } from '@/const';
import { useIsPageDAOMaker } from '@/custom/bridge/location';
import Intl from '@/i18n/i18n';
import { useAccountStore, useBridgeModeStore } from '@/store/store';
import { AIRDROP_AMOUNT } from '@/utils/const';

export function MASBalance() {
  const [balance, setBalance] = useState<IAccountBalanceResponse>();

  const { connectedAccount } = useAccountStore();
  const { chain } = useAccount();
  const { isMainnet } = useBridgeModeStore();
  const isPageDAOMaker = useIsPageDAOMaker();

  useEffect(() => {
    if (!connectedAccount) return;
    fetchMASBalance(connectedAccount).then((balance) => {
      setBalance(balance);
    });
  }, [connectedAccount, setBalance]);

  const { full } = formatAmount(fromMAS(balance?.candidateBalance || '0'), 9);

  const isBalanceZero = balance?.candidateBalance === '0';

  const renderCustomTooltip =
    isBalanceZero && isMainnet() && chain?.id === mainnet.id && !isPageDAOMaker;

  return (
    <div className="flex gap-2 mas-body">
      {Intl.t('connect-wallet.connected-cards.wallet-balance')}
      {balance === undefined ? (
        <FetchingLine />
      ) : (
        <>
          {full} {MASSA_TOKEN}
          {renderCustomTooltip && <CustomInfoTag />}
        </>
      )}
    </div>
  );
}

export function CustomInfoTag() {
  return (
    <Tooltip
      body={
        <div>
          {Intl.t('connect-wallet.empty-balance-description', {
            amount: AIRDROP_AMOUNT,
          })}
        </div>
      }
    >
      <Tag type="info" customClass="flex items-center gap-2">
        {Intl.t('connect-wallet.empty-balance', {
          amount: AIRDROP_AMOUNT,
        })}

        <FiHelpCircle className="text-s-info-1" />
      </Tag>
    </Tooltip>
  );
}
