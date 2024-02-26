import { useEffect, useState } from 'react';

import { fromMAS } from '@massalabs/massa-web3';
import { Tag, Tooltip } from '@massalabs/react-ui-kit';
import { IAccountBalanceResponse } from '@massalabs/wallet-provider';

import { FiHelpCircle } from 'react-icons/fi';
import { fetchMASBalance } from '@/bridge';
import { massaToken } from '@/const';
import Intl from '@/i18n/i18n';
import { FetchingLine } from '@/pages/Index/Layouts/LoadingLayout/FetchingComponent';
import { useAccountStore } from '@/store/store';
import { formatAmount } from '@/utils/parseAmount';

export function MASBalance() {
  const [balance, setBalance] = useState<IAccountBalanceResponse>();

  const { connectedAccount } = useAccountStore();

  useEffect(() => {
    if (!connectedAccount) return;
    fetchMASBalance(connectedAccount).then((balance) => {
      setBalance(balance);
    });
  }, [connectedAccount, setBalance]);

  const formattedBalance = formatAmount(
    fromMAS(balance?.candidateBalance || '0').toString(),
    9,
  ).amountFormattedFull;

  return (
    <div className="flex gap-2 mas-body">
      {Intl.t('connect-wallet.connected-cards.wallet-balance')}
      {balance === undefined ? (
        <FetchingLine />
      ) : (
        <>
          {formattedBalance} {massaToken}
          <CustomInfoTag />
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
        {Intl.t(`connect-wallet.empty-balance`)}
        {/* <Tooltip
          customClass="w-96 bg-text-s-info-1"
        body={Intl.t(`connect-wallet.empty-balance-description`)}
        /> */}
        {showTooltip && (
          <div
            className={`w-96 left-[450px] top-[550px] z-10 absolute bg-tertiary p-3 rounded-lg text-neutral ml-2`}
          >
            {Intl.t(`connect-wallet.empty-balance-description`)}
          </div>
        )}
        <FiHelpCircle className="text-s-info-1" />
      </Tag>
    </div>
  );
}
