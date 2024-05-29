import { useState } from 'react';

import { Navbar } from './Navbar';
import { BridgeLogo } from '@/assets/BridgeLogo';
import { ConnectWalletPopup, Footer } from '@/components';
import { DisabledBridgeBanner } from '@/components/DisabledBridgeBanner/DisabledBridgeBanner';
import Intl from '@/i18n/i18n';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout(props: MainLayoutProps) {
  const { children } = props;

  const [open, setOpen] = useState(false);

  return (
    <div
      className=" flex flex-col justify-between 
      bg-fixed bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))]
      from-bright-blue to-deep-blue to-60% overflow-auto w-full min-h-screen
      "
    >
      <Navbar setOpen={setOpen} />
      <div className="hidden sm:flex flex-col justify-center items-center pt-8 pb-10">
        <DisabledBridgeBanner />
        {children}
      </div>
      {open && <ConnectWalletPopup setOpen={setOpen} />}
      <div className="hidden sm:block">
        <Footer />
      </div>

      {/* display only on mobile*/}
      <div className="sm:hidden h-screen flex items-center justify-center">
        <div className="flex flex-col w-full gap-10 p-4">
          <BridgeLogo />
          <p className="mas-banner text-6xl text-f-primary mb-6">
            {Intl.t('desktop.title')}
          </p>
        </div>
      </div>
    </div>
  );
}
