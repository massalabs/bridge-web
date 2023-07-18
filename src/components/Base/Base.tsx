import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/custom/useLocalStorage';
import { useConfigStore } from '@/store/store';

import { Toast } from '@massalabs/react-ui-kit';
import { LayoutBridge } from '@/layouts/LayoutBridge/LayoutBridge';

export interface IOutletContextType {
  themeIcon: JSX.Element;
  themeLabel: string;
  theme: string;
  handleSetTheme: () => void;
}

export function Base() {
  const navigate = useNavigate();

  // Hooks
  const [theme, setThemeStorage] = useLocalStorage<string>(
    'bridge-theme',
    'theme-dark',
  );

  useEffect(() => {
    navigate('testnet/index');
  }, [navigate]);

  // Store
  const setThemeStore = useConfigStore((s) => s.setTheme);

  // Functions
  function handleSetTheme() {
    let toggledTheme = theme === 'theme-dark' ? 'theme-light' : 'theme-dark';

    setThemeStorage(toggledTheme);
    setThemeStore(toggledTheme);
  }

  // Template
  return (
    <div className={theme}>
      <LayoutBridge onSetTheme={handleSetTheme} storedTheme={theme}>
        <Outlet />
        <Toast />
      </LayoutBridge>
    </div>
  );
}
