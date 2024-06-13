import { formatAmount } from '@massalabs/react-ui-kit';
import Intl from '@/i18n/i18n';
import { useOperationStore } from '@/store/operationStore';
import { useTokenStore } from '@/store/tokenStore';

export function OperationInput() {
  const { inputAmount } = useOperationStore();
  const { selectedToken } = useTokenStore();
  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between mas-menu-default">
          <div>{Intl.t('confirmation.sending')}</div>
          <div>{`${
            formatAmount(inputAmount || '0', selectedToken?.decimals).full
          } ${selectedToken?.symbol}`}</div>
        </div>
        <div className="flex items-center justify-between mas-caption">
          <div>{Intl.t('confirmation.token-address')}</div>
          <div>{selectedToken?.evmToken}</div>
        </div>
      </div>
    </div>
  );
}
