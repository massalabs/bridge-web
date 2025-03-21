import { Link } from 'react-router-dom';

import Intl from '@/i18n/i18n';

export function Error() {
  return (
    <div id="error-page" className="text-f-primary">
      <h1 className="mas-banner">{Intl.t('unexpected-error.title')}</h1>
      <p className="mas-body">{Intl.t('unexpected-error.description')}</p>
      <Link to={'index'} className="underline">
        {Intl.t('unexpected-error.link')}
      </Link>
    </div>
  );
}
