import Intl from '@/i18n/i18n';

export function MetamaskNotInstalled() {
  const metamaskDownloadLink = 'https://metamask.io/download/';
  return (
    <>
      <p>
        {Intl.t('connect-wallet.connect-metamask.no-metamask')}
        <br />
        <a className="underline" href={metamaskDownloadLink} target="_blank">
          {Intl.t('connect-wallet.connect-metamask.install-metamask')}
        </a>
      </p>
    </>
  );
}
