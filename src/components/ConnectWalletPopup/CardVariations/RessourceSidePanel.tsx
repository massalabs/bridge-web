import { Tag } from '@massalabs/react-ui-kit';
import Intl from '@/i18n/i18n';

export function RessourceSidePanel() {
  return (
    <div
      className="
        bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]
        from-bright-blue to-deep-blue to-60%
        min-h-full w-[270px] p-6 rounded-2xl
        flex flex-col justify-evenly items-center gap-4
        "
    >
      <div className="flex flex-col justify-center items-center gap-4 mas-menu-default">
        <Tag type="info" content="Add Sepolia testnet" />
        <div className="text-center">
          {Intl.t('connect-wallet.ressource-sidepanel.add-sepolia')}
        </div>
        <br />
        <a href="www.mylink.com" target="_blank">
          <u>{Intl.t('general.click-here')}</u>
        </a>
      </div>
      <div className="w-full bg-slate-500 bg-opacity-5 border border-1"></div>
      <div className="flex flex-col justify-center items-center gap-4 mas-menu-default">
        <Tag type="success" content="Create a Massa Wallet" />
        <div className="text-center">
          {Intl.t('connect-wallet.ressource-sidepanel.add-massa')}
        </div>
        <br />
        <a href="www.mylink.com" target="_blank">
          <u> {Intl.t('general.click-here')}</u>
        </a>
      </div>
    </div>
  );
}
