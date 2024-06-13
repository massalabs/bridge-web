import { formatAmount } from '@massalabs/react-ui-kit';
import Intl from '@/i18n/i18n';
import { useTokenStore, useOperationStore } from '@/store/store';

export function OperationOutput() {
  const { outputAmount } = useOperationStore();
  const { selectedToken } = useTokenStore();

  return (
    <div className="flex itmes-center w-full justify-between mas-menu-default">
      <div>{Intl.t('index.input.placeholder.receive')}</div>
      <div>
        {`${formatAmount(outputAmount || '', selectedToken?.decimals).full} ${
          selectedToken?.symbol
        }`}
      </div>
    </div>
  );
}
