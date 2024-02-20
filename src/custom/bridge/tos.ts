import { _getFromStorage, _setInStorage } from '../../utils/storage';
import { useAccountStore } from '@/store/store';

export function areTosValid(): boolean {
  const { setTosAcceptance } = useAccountStore.getState();

  const lastAcceptanceDateTime = _getFromStorage('tosAcceptanceDateTime');

  if (lastAcceptanceDateTime) {
    const lastAcceptanceDate = new Date(lastAcceptanceDateTime);
    const currentDate: Date = new Date();
    const timeDifference = currentDate.getTime() - lastAcceptanceDate.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    if (hoursDifference >= 1) {
      setTosAcceptance(false);
      return false;
    } else {
      return true;
    }
  }
  return false;
}

export function acceptTos() {
  const { setTosAcceptance } = useAccountStore.getState();

  const currentDate = new Date();
  const acceptanceDateTime = currentDate.toISOString();
  _setInStorage('tosAcceptanceDateTime', acceptanceDateTime);
  setTosAcceptance(true);
}
