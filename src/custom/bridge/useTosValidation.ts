import { useLocalStorage } from 'usehooks-ts';
import {
  LAST_TOS_ACCEPTANCE,
  _getFromStorage,
  _setInStorage,
} from '../../utils/storage';

export function useTosValidation() {
  const [lastAcceptanceDateTime, setLastAcceptanceDateTime] = useLocalStorage(
    LAST_TOS_ACCEPTANCE,
    '',
  );

  function areTosValid(): boolean {
    if (lastAcceptanceDateTime) {
      const lastAcceptanceDate = new Date(lastAcceptanceDateTime);
      const currentDate: Date = new Date();
      const timeDifference =
        currentDate.getTime() - lastAcceptanceDate.getTime();
      const hoursDifference = timeDifference / (1000 * 60 * 60);

      if (hoursDifference >= 1) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  function acceptTos() {
    const currentDate = new Date();
    const acceptanceDateTime = currentDate.toISOString();
    setLastAcceptanceDateTime(acceptanceDateTime);
  }
  return { areTosValid, acceptTos };
}
