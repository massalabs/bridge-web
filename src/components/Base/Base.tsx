import { useEffect } from 'react';

import { Toast } from '@massalabs/react-ui-kit';
import { Outlet, useNavigate } from 'react-router-dom';

import { BridgeMode } from '@/const';
import { NO_BRIDGE, SC_DEPLOY } from '@/const/env/maintenance';
import { useLocalStorage } from '@/custom/useLocalStorage';
import { MainLayout } from '@/layouts/LayoutBridge/MainLayout';
import { useBridgeModeStore, useConfigStore } from '@/store/store';

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
  const { currentMode } = useBridgeModeStore();

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

  const themeClassName =
    theme + (currentMode === BridgeMode.mainnet ? '' : '-testnet');

  // Template
  return (
    <div className={themeClassName}>
      <MainLayout onSetTheme={handleSetTheme} storedTheme={theme}>
        <Outlet />
        <Toast />
      </MainLayout>
    </div>
  );
}
