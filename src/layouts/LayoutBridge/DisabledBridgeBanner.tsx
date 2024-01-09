import { useState } from 'react';

import { BridgeLogo } from '@massalabs/react-ui-kit';

import { Navbar } from './Navbar';
import { ConnectWalletPopup, Footer } from '@/components';
import { DisabledBridgeBanner } from '@/components/TopBanner/TopBanner';
import Intl from '@/i18n/i18n';

export function LayoutBridge({ ...props }) {
  const { onSetTheme, storedTheme, children } = props;

  const [selectedTheme, setSelectedTheme] = useState(
    storedTheme || 'theme-dark',
  );
  const [open, setOpen] = useState(false);

  return (
    <div
      className="bg-fixed bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))]
      from-bright-blue to-deep-blue to-60% overflow-auto w-full min-h-screen
      "
    >
      <Navbar
        onSetTheme={onSetTheme}
        setSelectedTheme={setSelectedTheme}
        selectedTheme={selectedTheme}
        setOpen={setOpen}
      />
      <div className="hidden sm:flex flex-col justify-center items-center pt-32 pb-10">
        <DisabledBridgeBanner />
        {children}
      </div>
      {open && <ConnectWalletPopup setOpen={setOpen} />}
      <div className="hidden sm:block">
        <Footer selectedTheme={selectedTheme} />
      </div>

      {/* display only on mobile*/}
      <div className="sm:hidden h-screen flex items-center justify-center">
        <div className="flex flex-col w-full gap-10 p-4">
          <BridgeLogo theme={selectedTheme} />
          <p className="mas-banner text-6xl text-f-primary mb-6">
            {Intl.t('desktop.title')}
          </p>
        </div>
      </div>
    </div>
  );
}
