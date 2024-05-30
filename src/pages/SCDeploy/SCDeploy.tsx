import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { BridgeLogo } from '@/assets/BridgeLogo';
import { SC_DEPLOY } from '@/const/env/maintenance';
import Intl from '@/i18n/i18n';
import { useConfigStore } from '@/store/store';

export function SCDeploy() {
  const navigate = useNavigate();
  const { theme } = useConfigStore();

  useEffect(() => {
    if (!SC_DEPLOY) {
      navigate('/index');
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
              {Intl.t('sc-deploy.title')}
            </p>
            <p className="mas-subtitle text-f-primary">
              {Intl.t('sc-deploy.subtitle')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
