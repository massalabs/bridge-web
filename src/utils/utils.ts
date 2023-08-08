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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeJsonParse(str: string): any {
  try {
    return JSON.parse(str);
  } catch (e) {
    return undefined;
  }
}
