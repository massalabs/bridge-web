import { BridgeRedeemLayout } from './Layouts/BridgeRedeemLayout/BridgeRedeemLayout';

import { ClaimTokensPopup } from '@/components/ClaimTokensPopup/ClaimTokensPopup';

export function IndexPage() {
  return (
    <div className="flex flex-col gap-36 items-center justify-center w-full h-full">
      <BridgeRedeemLayout />
      <ClaimTokensPopup />
    </div>
  );
}
