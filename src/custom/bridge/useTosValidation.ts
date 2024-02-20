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

  function checkTosValid(acceptandDate: string): boolean {
    const oneHourInMs = 60 * 60 * 1000;
    if (acceptandDate === '') return false;
    const lastAcceptanceDate = new Date(acceptandDate);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - lastAcceptanceDate.getTime();
    const hoursDifference = timeDifference / oneHourInMs;
    return hoursDifference < 1;
  }

  const areTosValid = checkTosValid(lastAcceptanceDateTime);

  function acceptTos() {
    const currentDate = new Date();
    const acceptanceDateTime = currentDate.toISOString();
    setLastAcceptanceDateTime(acceptanceDateTime);
  }
  return { areTosValid, acceptTos };
}
