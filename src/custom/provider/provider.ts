import { MASSA_WALLET_PROVIDER, MASSA_STATION } from '../../const/const';

export function registerEvent(
  name: string = MASSA_STATION,
  id: string = MASSA_WALLET_PROVIDER,
) {
  const registerEvent = new CustomEvent('register', {
    detail: { providerName: name },
  });

  const element = document.getElementById(id);

  if (element) {
    element.dispatchEvent(registerEvent);
  }
}
