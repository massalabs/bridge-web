import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { BridgeLogo } from '@/assets/BridgeLogo';
import { NO_BRIDGE } from '@/const/env/maintenance';
import Intl from '@/i18n/i18n';
import { useConfigStore } from '@/store/store';

export function Unavailable() {
  const navigate = useNavigate();

  const { theme } = useConfigStore();

  useEffect(() => {
    if (!NO_BRIDGE) {
      navigate(`/index`);
    }
  }, [navigate]);

  return (
    <div className={theme}>
      <div
        className="bg-fixed bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))]
                from-bright-blue to-deep-blue to-60% overflow-auto w-full"
      >
        <div className="h-screen flex items-center justify-center">
          <div className="flex flex-col w-full p-4">
            <BridgeLogo className="mb-8" />
            <p className="mas-banner text-6xl text-f-primary mb-6">
              {Intl.t('unavailable.title')}
            </p>
            <p className="mas-subtitle text-f-primary">
              {Intl.t('unavailable.subtitle')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
