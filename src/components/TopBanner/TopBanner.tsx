import { FiAlertTriangle } from 'react-icons/fi';

import { BRIDGE_OFF, REDEEM_OFF } from '@/const/env/maintenance';
import Intl from '@/i18n/i18n';

export function DisabledBridgeBanner() {
  const bridgeOff = Intl.t(`index.top-banner.bridge-off`);
  const redeemOff = Intl.t(`index.top-banner.redeem-off`);

  return (
    (BRIDGE_OFF || REDEEM_OFF) && (
      <div className="bg-brand w-full p-3.5 mb-10 flex justify-center items-center mas-h3 text-f-secondary">
        <FiAlertTriangle className="text-s-primary w-8 h-8 p-1" />
        <p className="flex">{BRIDGE_OFF ? bridgeOff : redeemOff}</p>
      </div>
    )
  );
}
