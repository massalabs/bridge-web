import Intl from '@/i18n/i18n';

export function GlobalErrorLayout() {
  return (
    <div className="text-center mas-body2">
      <p> {Intl.t('index.loading-box.error-something')}</p>
      <p> {Intl.t('index.loading-box.error-drop')}</p>
      <br />
      <u>
        <a href="mailto:support.bridge@massa.net" target="_blank">
          support.bridge@massa.net
        </a>
      </u>
    </div>
  );
}
