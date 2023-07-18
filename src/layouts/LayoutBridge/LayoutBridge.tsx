import { useState } from 'react';

import {
  Button,
  Dropdown,
  ThemeMode,
  BridgeLogo,
} from '@massalabs/react-ui-kit';
import { ConnectWalletPopup } from '@/components/ConnectWalletPopup/ConnectWalletPopup';

export function LayoutBridge({ ...props }) {
  const { onSetTheme, storedTheme, children } = props;

  const options = [
    {
      item: 'Buildnet',
    },
  ];

  const [selectedTheme, setSelectedTheme] = useState(
    storedTheme || 'theme-dark',
  );

  function handleSetTheme(theme: string) {
    setSelectedTheme(theme);

    onSetTheme?.(theme);
  }

  const [open, setOpen] = useState(false);

  const popupArgs = {
    setOpen,
  };

  return (
    <div
      className="bg-fixed bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))]
      from-[#3271A5] to-primary to-60% overflow-auto w-full min-h-screen
      "
    >
      {/* Header Element */}
      <div className="flex flex-row items-center justify-between p-11 w-full h-fit fixed z-10">
        <BridgeLogo theme={selectedTheme} />
        <div className="flex flex-row items-center gap-4">
          <Dropdown readOnly={true} options={options} />
          <Button onClick={() => setOpen(true)}>Connect Wallet</Button>
          <ThemeMode onSetTheme={handleSetTheme} />
        </div>
      </div>
      <div
        className={`flex flex-col justify-center items-center pt-[150px] pb-10`}
      >
        {children}
      </div>
      {open ? <ConnectWalletPopup {...popupArgs} /> : null}
    </div>
  );
}
