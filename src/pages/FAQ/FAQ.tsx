import { BuildnetFAQ, MainnetFAQ } from '.';
import { BridgeMode } from '@/const';
import { useBridgeModeStore } from '@/store/store';

export function FAQ() {
  // render logic between mainnet faq and buildnet faq will go here
  const { currentMode } = useBridgeModeStore();

  return (
    <>{currentMode === BridgeMode.mainnet ? <MainnetFAQ /> : <BuildnetFAQ />}</>
  );
}
