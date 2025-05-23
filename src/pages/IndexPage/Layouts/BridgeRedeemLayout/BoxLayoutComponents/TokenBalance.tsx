import { FetchingLine, Tooltip, formatAmount } from '@massalabs/react-ui-kit';
import useEvmToken from '@/custom/bridge/useEvmToken';
import Intl from '@/i18n/i18n';
import { useOperationStore } from '@/store/operationStore';
import { useTokenStore } from '@/store/tokenStore';

export function TokenBalance() {
  const { isMassaToEvm } = useOperationStore();
  const { selectedToken } = useTokenStore();
  const { tokenBalance: tokenBalanceEvm, isFetched } = useEvmToken();

  const decimals = selectedToken?.decimals || 18;

  let amount: bigint | undefined;
  let symbol: string | undefined;
  if (isMassaToEvm()) {
    amount = selectedToken?.balance;
    symbol = selectedToken?.symbol;
  } else {
    amount = tokenBalanceEvm;
    symbol = selectedToken?.symbolEVM;
  }

  let { preview, full } = formatAmount(
    amount ? amount.toString() : '0',
    decimals,
  );

  return (
    <div className="flex items-center gap-2 h-6">
      <p className="mas-body2">
        {Intl.t('connect-wallet.connected-cards.wallet-balance')}
      </p>
      <div className="mas-body">
        {!isFetched || !selectedToken || amount === undefined ? (
          <FetchingLine />
        ) : (
          <div className="flex gap-2 items-center mas-caption">
            {`${preview} ${symbol}`}
            <Tooltip body={full + ' ' + symbol ?? ''} />
          </div>
        )}
      </div>
    </div>
  );
}
