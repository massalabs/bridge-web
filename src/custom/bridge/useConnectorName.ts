import { useAccount } from 'wagmi';
import { Blockchain } from '@/const';
import Intl from '@/i18n/i18n';

export function useConnectorName() {
  const { connector } = useAccount();

  return connector ? connector.name : Intl.t(`general.${Blockchain.UNKNOWN}`);
}
