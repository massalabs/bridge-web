import { useState } from 'react';

import { FiX } from 'react-icons/fi';

export interface BannerProps {
  textToDisplay: string;
  canBeClosed?: boolean;
}

export function Banner(props: BannerProps) {
  const { textToDisplay, canBeClosed = false } = props;
  const [showBanner, setShowBanner] = useState(true);

  const handleBannerClose = () => {
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="w-full h-9 p-1 bg-brand items-center gap-2.5 justify-center grid">
      <div className="w-full mas-menu-default text-deep-blue">
        {textToDisplay}
      </div>
      {canBeClosed && (
        <div className="absolute right-0 mr-4 cursor-pointer">
          <FiX className="text-deep-blue" onClick={handleBannerClose} />
        </div>
      )}
    </div>
  );
}
