import {
  MASSA_WALLET_PROVIDER,
  SUPPORTED_MASSA_WALLETS,
} from '../../const/const';

export function registerEvent(
  name: string = SUPPORTED_MASSA_WALLETS.MASSASTATION,
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
