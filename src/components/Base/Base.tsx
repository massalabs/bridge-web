import { useEffect } from 'react';

import { Toast } from '@massalabs/react-ui-kit';
import { Outlet, useNavigate } from 'react-router-dom';

import { NO_BRIDGE, SC_DEPLOY } from '@/const/env/maintenance';
import { useLocalStorage } from '@/custom/useLocalStorage';
import { LayoutBridge } from '@/layouts/LayoutBridge/LayoutBridge';
import { useConfigStore } from '@/store/store';

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

  // Store
  const setThemeStore = useConfigStore((s) => s.setTheme);

  // Functions
  function handleSetTheme() {
    let toggledTheme = theme === 'theme-dark' ? 'theme-light' : 'theme-dark';

    setThemeStorage(toggledTheme);
    setThemeStore(toggledTheme);
  }

  useEffect(() => {
    if (SC_DEPLOY) {
      navigate(`/sc-deploy`);
    } else if (NO_BRIDGE) {
      navigate(`/unavailable`);
    } else {
      navigate(`/index`);
    }
  }, [navigate]);

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
