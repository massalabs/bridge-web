import { useEffect, useRef } from 'react';

import { FAQ } from '@massalabs/react-ui-kit';

import { AddTokensFAQ, GetTokensFAQ } from './FAQCategories';
import { FAQsections, isEqual } from '@/const/faq';
import { useQuery } from '@/custom/api/useQuery';
import Intl from '@/i18n/i18n';

export function TokensFAQ() {
  const query = useQuery();

  const getTokensSection = useRef<HTMLDivElement | null>(null);

  const sectionToNavigate: string | null = query.get('section');
  const categoryToNavigate: string | null = query.get('category');

  useEffect(() => {
    if (sectionToNavigate !== null) {
      scrollToFAQ();
    }
  }, [sectionToNavigate]);

  function scrollToFAQ() {
    if (getTokensSection.current !== null) {
      getTokensSection.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className="w-1/2 flex flex-col gap-5 items-center">
      <div ref={getTokensSection}>
        <p className="mas-title text-neutral">FAQ</p>
      </div>
      <FAQ
        state={isEqual(sectionToNavigate, FAQsections.getTokens)}
        title={Intl.t('index.faq.get-tokens.title')}
      >
        <GetTokensFAQ category={categoryToNavigate} />
      </FAQ>

      <FAQ
        state={isEqual(sectionToNavigate, FAQsections.addTokens)}
        title={Intl.t('index.faq.add-tokens.title')}
      >
        <AddTokensFAQ category={categoryToNavigate} />
      </FAQ>
    </div>
  );
}
