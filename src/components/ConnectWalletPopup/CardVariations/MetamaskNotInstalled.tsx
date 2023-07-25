import Intl from '@/i18n/i18n';

export function MetamaskNotInstalled() {
  const metamaskDownloadLink = 'https://metamask.io/download/';
  return (
    <>
      <p>
        {Intl.t('connect-wallet.connect-metamask.no-metamask')}
        <br />{' '}
        {Intl.t('connect-wallet.connect-metamask.download-metamask-action')}
        <u>
          <a href={metamaskDownloadLink} target="_blank">
            {Intl.t('connect-wallet.connect-metamask.installation-process')}
          </a>
        </u>
      </p>
    </>
  );
}
