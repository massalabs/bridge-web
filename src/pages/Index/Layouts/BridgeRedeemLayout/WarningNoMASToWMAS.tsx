import { FiAlertTriangle } from 'react-icons/fi';
import Intl from '@/i18n/i18n';
import { useOperationStore, useTokenStore } from '@/store/store';
import { SIDE } from '@/utils/const';

export function WarningNoMASToWMAS() {
  const { side } = useOperationStore();
  const { selectedToken } = useTokenStore();

  if (side === SIDE.EVM_TO_MASSA || selectedToken?.symbol !== 'MAS')
    return null;

  return (
    <div className="flex items-center gap-2">
      <FiAlertTriangle className="text-s-warning" size={24} />
      <p className="mas-body2 text-s-warning">
        {Intl.t('index.warning-no-mas-to-wmas')}
      </p>
    </div>
  );
}
