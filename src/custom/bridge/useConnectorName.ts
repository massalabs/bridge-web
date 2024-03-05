import { useAccount } from 'wagmi';
import { Blockchain } from '@/const';
import Intl from '@/i18n/i18n';
export const useConnectorName = () => {
  const { connector } = useAccount();

  if (connector) {
    return connector.name;
  }
  return Intl.t(`general.${Blockchain.UNKNOWN}`);
};
