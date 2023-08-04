import { NavigateFunction } from 'react-router-dom';

export function goToErrorPage(navigate: NavigateFunction) {
  navigate('error');
}

export function formatBalance(
  balanceFormatted: string | undefined,
): string | undefined {
  try {
    if (!balanceFormatted) {
      return undefined;
    }
    const balance: number = parseFloat(balanceFormatted);

    const formattedBalance: string = balance.toFixed(6);

    return formattedBalance;
  } catch (error) {
    return 'Invalid input: ' + balanceFormatted;
  }
}

export function isJSON(str: string): boolean {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
