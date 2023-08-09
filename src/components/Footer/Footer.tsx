import { BridgeLogo } from '@massalabs/react-ui-kit';
import { useNavigate } from 'react-router-dom';

import { MassaIconSvg, MassaStationIconSvg } from '@/assets';

interface FooterProps {
  selectedTheme: 'theme-light' | 'theme-dark' | undefined;
}

export function Footer(props: FooterProps) {
  const { selectedTheme } = props;

  const navigate = useNavigate();

  return (
    <footer className="py-20 px-28 text-f-primary">
      <div className="pt-10 flex justify-between items-center border-t border-neutral/40">
        <BridgeLogo
          theme={selectedTheme}
          onClick={() => navigate('buildnet/index')}
          className="cursor-pointer"
        />
        <ul className="m-0 p-0 list-none flex items-center gap-6">
          <li>
            <a
              onClick={() => window.open('https://massa.net', '_blank')}
              className="mas-menu-default no-underline cursor-pointer flex items-center gap-2"
            >
              <MassaIconSvg selectedTheme={selectedTheme} />
              Massa
            </a>
          </li>
          <li>
            <a
              onClick={() => window.open('https://station.massa.net', '_blank')}
              className="mas-menu-default no-underline cursor-pointer flex items-center gap-2"
            >
              <MassaStationIconSvg selectedTheme={selectedTheme} />
              Massa Station
            </a>
          </li>
          <li>
            <a className="mas-menu-default no-underline cursor-pointer">
              Terms of Service
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
