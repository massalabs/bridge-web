import { useAccount } from 'wagmi';
import { wmasSymbol } from '../DaoPage';
import { Blockchain } from '@/const';
import Intl from '@/i18n/i18n';
import { useBridgeModeStore } from '@/store/store';

interface ReleaseSuccessProps {
  amount: string;
}

export function ReleaseSuccess(props: ReleaseSuccessProps) {
  const { amount } = props;
  const { chain } = useAccount();
  const { massaNetwork: getMassaNetwork } = useBridgeModeStore();
  const massaNetwork = getMassaNetwork();

  if (!chain) return null;

  const massaChainAndNetwork = `${Blockchain.MASSA} ${Intl.t(
    `general.${massaNetwork}`,
  )}`;

  const emitter = chain.name;
  const recipient = massaChainAndNetwork;

  return (
    <div className="flex flex-col gap-2 text-center">
      <div>{Intl.t('dao-maker.success')}</div>
      <div className="mas-subtitle p-2">
        {amount} {wmasSymbol}
      </div>
      <div>
        {Intl.t('index.loading-box.from-to', {
          from: emitter,
          to: recipient,
        })}
      </div>
      <div>{Intl.t('dao-maker.success-received', { amount })}</div>
    </div>
  );
}
