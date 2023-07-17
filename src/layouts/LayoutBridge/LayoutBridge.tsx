import { useState } from 'react';

import {
  Button,
  Dropdown,
  ThemeMode,
  BridgeLogo,
} from '@massalabs/react-ui-kit';
import logo from '@/assets/logo.svg';

export function LayoutBridge({ ...props }) {
  const { onSetTheme, storedTheme, children } = props;

  const options = [
    {
      item: 'testnet',
    },
  ];

  const [selectedTheme, setSelectedTheme] = useState(
    storedTheme || 'theme-dark',
  );

  function handleSetTheme(theme: string) {
    setSelectedTheme(theme);

    onSetTheme?.(theme);
  }

  return (
    <div
      className="bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))]
      from-[#3271A5] to-primary to-60% fixed w-full min-h-screen
      "
    >
      {/* Header Element */}
      <div className="flex flex-row items-center justify-between p-11 h-fit">
        <BridgeLogo theme={selectedTheme} />
        <div className="flex flex-row items-center gap-4">
          <Dropdown readOnly={true} options={options} />
          <Button>Connect Wallet</Button>
          <ThemeMode onSetTheme={handleSetTheme} />
        </div>
      </div>
      <div className={`flex flex-col justify-center items-center`}>
        {children}
      </div>
    </div>
  );
}
