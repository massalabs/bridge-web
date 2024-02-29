import { BuildnetFAQ, MainnetFAQ } from '.';
import { useBridgeModeStore } from '@/store/store';

export function FAQ() {
  // render logic between mainnet faq and buildnet faq will go here
  const { isMainnet } = useBridgeModeStore();

  return <>{isMainnet() ? <MainnetFAQ /> : <BuildnetFAQ />}</>;
}
