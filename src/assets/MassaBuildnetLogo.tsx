import { SVGProps } from '@massalabs/react-ui-kit';

import { useConfigStore } from '@/store/store';
/* eslint-disable max-len */
export function MassaBuildnetLogo(props: SVGProps) {
  let { size } = props;

  const { theme } = useConfigStore();

  const white = 'white';
  const dark = '#151A26';

  const fillColor = theme === 'theme-dark' ? white : dark;
  const detailColor = theme === 'theme-dark' ? dark : white;
  return (
    <svg
      width={size ?? 44}
      height={size ?? 44}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
        fill={fillColor}
      />
      <path
        d="M23.101 16.2621L25.5516 12.0164L24.3918 10.0217H19.4878L22.3373 5.10345C21.5595 4.64956 20.735 4.2808 19.8782 4.00354L16 10.6714L17.1711 12.6831H22.0752L19.6246 16.9318L20.7843 18.9464H28.2842C28.495 18.0666 28.6106 17.1666 28.629 16.2621H23.101Z"
        fill={detailColor}
      />
      <path
        d="M14.8374 26.546H17.1711L19.6274 22.3002L22.3003 26.9307C23.0811 26.4815 23.8119 25.9504 24.4801 25.3464L20.7758 18.9407H18.4534L15.9971 23.1893L13.5466 18.9521H11.2214L7.517 25.3578C8.18421 25.9631 8.91511 26.4943 9.69687 26.9421L12.3726 22.3088L14.8374 26.546Z"
        fill={detailColor}
      />
      <path
        d="M12.3811 16.9318L9.93338 12.6832H14.8345L16 10.6714L12.1332 3.98364C11.2764 4.2609 10.4519 4.62966 9.67407 5.08355L12.5236 10.0018H7.61388L6.45128 11.9965L8.90186 16.2479H3.38235C3.3994 17.1591 3.515 18.0658 3.72715 18.9521H11.2214L12.3811 16.9318Z"
        fill={detailColor}
      />
    </svg>
  );
}
