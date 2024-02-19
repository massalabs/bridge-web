import { _getFromStorage, _setInStorage } from './storage';

export function areTosValid() {
  const lastAcceptanceDateTime = _getFromStorage('tosAcceptanceDateTime');

  if (lastAcceptanceDateTime) {
    const lastAcceptanceDate = new Date(lastAcceptanceDateTime);
    const currentDate: Date = new Date();
    const timeDifference = currentDate.getTime() - lastAcceptanceDate.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    if (hoursDifference >= 1) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

export function acceptTos() {
  const currentDate = new Date();
  const acceptanceDateTime = currentDate.toISOString();
  _setInStorage('tosAcceptanceDateTime', acceptanceDateTime);
  console.log(acceptanceDateTime);
}
