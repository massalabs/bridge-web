import { useLocation } from 'react-router-dom';
import { PAGES } from '@/const';

export function useIsPageDAOMaker(): boolean {
  const { pathname } = useLocation();
  return pathname.includes(PAGES.DAO);
}

export function useIsPageBridge(): boolean {
  const { pathname } = useLocation();
  return pathname.includes(PAGES.INDEX);
}
