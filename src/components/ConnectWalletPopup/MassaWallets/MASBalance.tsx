import { useEffect, useState } from 'react';

import { fromMAS } from '@massalabs/massa-web3';
import { Tag } from '@massalabs/react-ui-kit';
import { IAccountBalanceResponse } from '@massalabs/wallet-provider';

import { FiHelpCircle } from 'react-icons/fi';
import { fetchMASBalance } from '@/bridge';
import { MASSA_TOKEN } from '@/const';
import Intl from '@/i18n/i18n';
import { FetchingLine } from '@/pages/IndexPage/Layouts/LoadingLayout/FetchingComponent';
import { useAccountStore, useBridgeModeStore } from '@/store/store';
import { AIRDROP_AMOUNT } from '@/utils/const';
import { formatAmount } from '@/utils/parseAmount';

export function MASBalance() {
  const [balance, setBalance] = useState<IAccountBalanceResponse>();

  const { connectedAccount } = useAccountStore();
  const { isMainnet } = useBridgeModeStore();

  useEffect(() => {
    if (!connectedAccount) return;
    fetchMASBalance(connectedAccount).then((balance) => {
      setBalance(balance);
    });
  }, [connectedAccount, setBalance]);

  const { amountFormattedFull } = formatAmount(
    fromMAS(balance?.candidateBalance || '0').toString(),
    9,
  );

  const isBalanceZero = balance?.candidateBalance === '0';

  const renderCustomTooltip = isBalanceZero && isMainnet();

  return (
    <div className="flex gap-2 mas-body">
      {Intl.t('connect-wallet.connected-cards.wallet-balance')}
      {balance === undefined ? (
        <FetchingLine />
      ) : (
        <>
          {amountFormattedFull} {MASSA_TOKEN}
          {renderCustomTooltip && <CustomInfoTag />}
        </>
      )}
    </div>
  );
}

export function CustomInfoTag() {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className="flex hover:cursor-pointer"
    >
      <Tag type="info" customClass="flex items-center gap-2">
        {Intl.t(`connect-wallet.empty-balance`, {
          amount: AIRDROP_AMOUNT,
        })}
        {showTooltip && (
          <div
            className={`w-96 left-[480px] top-[515px] z-10 absolute bg-tertiary p-3 rounded-lg text-neutral ml-2`}
          >
            {Intl.t(`connect-wallet.empty-balance-description`, {
              amount: AIRDROP_AMOUNT,
            })}
          </div>
        )}
        <FiHelpCircle className="text-s-info-1" />
      </Tag>
    </div>
  );
}
