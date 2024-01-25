import { useNavigate } from 'react-router-dom';

import { MassaIconSvg, MassaStationIconSvg } from '@/assets';
import { BridgeLogo } from '@/assets/BridgeLogo';
import Intl from '@/i18n/i18n';
import { useConfigStore } from '@/store/store';

export function Footer() {
  const { theme } = useConfigStore();

  const navigate = useNavigate();

  return (
    <footer className="py-20 px-28 text-f-primary">
      <div className="pt-10 flex justify-between items-center border-t border-neutral/40">
        <BridgeLogo
          onClick={() => navigate('/index')}
          className="cursor-pointer"
        />
        <ul className="m-0 p-0 list-none flex items-center gap-6">
          <li>
            <a
              className="mas-menu-default no-underline cursor-pointer flex items-center gap-2"
              href="https://massa.net"
              target="_blank"
            >
              <MassaIconSvg theme={theme} />
              {Intl.t(`index.footer.massa`)}
            </a>
          </li>
          <li>
            <a
              className="mas-menu-default no-underline cursor-pointer flex items-center gap-2"
              href="https://station.massa.net"
              target="_blank"
            >
              <MassaStationIconSvg theme={theme} />
              {Intl.t(`index.footer.massa-station`)}
            </a>
          </li>
          <li>
            <a
              className="mas-menu-default no-underline cursor-pointer"
              href="/legal/ToS.pdf"
              target="_blank"
            >
              {Intl.t('index.footer.tos')}
            </a>
          </li>
          <li>
            <a
              className="mas-menu-default no-underline cursor-pointer"
              href="/legal/PP.pdf"
              target="_blank"
            >
              {Intl.t('index.footer.pop')}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
