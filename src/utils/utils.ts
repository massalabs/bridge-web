import { NavigateFunction } from 'react-router-dom';

export function goToErrorPage(navigate: NavigateFunction) {
  navigate('error');
}
