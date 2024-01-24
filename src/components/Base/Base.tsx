import { useEffect } from 'react';

import { Toast } from '@massalabs/react-ui-kit';
import { Outlet, useNavigate } from 'react-router-dom';

import { BridgeMode } from '@/const';
import { NO_BRIDGE, SC_DEPLOY } from '@/const/env/maintenance';
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

  const { theme } = useConfigStore();
  const { currentMode } = useBridgeModeStore();

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
    theme.replace('theme-', '') +
    (currentMode === BridgeMode.mainnet ? '' : '-testnet');

  // Template
  return (
    <div data-theme={themeClassName}>
      <MainLayout>
        <Outlet />
        <Toast />
      </MainLayout>
    </div>
  );
}
