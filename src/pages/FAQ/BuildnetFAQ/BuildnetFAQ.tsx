import { useEffect, useRef } from 'react';

import { Accordion } from '@massalabs/react-ui-kit';

import { AddTokensFAQ, GetTokensFAQ } from './BuildnetFAQCategories';
import { FAQsections } from '@/const/faq';
import { useQuery } from '@/custom/api/useQuery';
import Intl from '@/i18n/i18n';

export function BuildnetFAQ() {
  const query = useQuery();

  const getTokensSection = useRef<HTMLDivElement | null>(null);

  const sectionToNavigate: string | null = query.get('section');
  const categoryToNavigate: string | null = query.get('category');

  useEffect(() => {
    if (sectionToNavigate) {
      scrollToFAQ();
    }
  }, [sectionToNavigate]);

  function scrollToFAQ() {
    if (getTokensSection.current) {
      getTokensSection.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const showGetTokens = sectionToNavigate === FAQsections.getTokens;
  const showAddTokens = sectionToNavigate === FAQsections.addTokens;

  return (
    <div className="w-1/2 flex flex-col gap-5 items-center">
      <div ref={getTokensSection}>
        <p className="mas-title text-neutral">FAQ</p>
      </div>
      <Accordion
        state={showGetTokens}
        title={Intl.t('index.faq.get-tokens.title')}
      >
        <GetTokensFAQ category={categoryToNavigate} />
      </Accordion>

      <Accordion
        state={showAddTokens}
        title={Intl.t('index.faq.add-tokens.title')}
      >
        <AddTokensFAQ category={categoryToNavigate} />
      </Accordion>
    </div>
  );
}
