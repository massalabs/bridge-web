/* eslint-disable max-len */
import { ComponentPropsWithoutRef } from 'react';

export interface SVGProps extends ComponentPropsWithoutRef<'div'> {
  size?: number;
}

export function BNBSvg(props: SVGProps) {
  let { size } = props;
  return (
    <svg
      width={size ?? 44}
      height={size ?? 44}
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_495_2)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M21 0C32.5988 0 42 9.4012 42 21C42 32.5988 32.5988 42 21 42C9.4012 42 0 32.5988 0 21C0 9.4012 9.4012 0 21 0Z"
          fill="#F0B90B"
        />
        <path
          d="M11.5415 20.9999L11.5567 26.5528L16.275 29.3292V32.5802L8.79538 28.1934V19.3761L11.5415 20.9999ZM11.5415 15.447V18.6828L8.7937 17.0573V13.8215L11.5415 12.196L14.3028 13.8215L11.5415 15.447ZM18.2454 13.8215L20.9932 12.196L23.7545 13.8215L20.9932 15.447L18.2454 13.8215Z"
          fill="white"
        />
        <path
          d="M13.5271 25.4018V22.1509L16.2749 23.7763V27.0122L13.5271 25.4018ZM18.2454 30.4936L20.9932 32.1191L23.7545 30.4936V33.7295L20.9932 35.3549L18.2454 33.7295V30.4936ZM27.6954 13.8215L30.4432 12.196L33.2045 13.8215V17.0573L30.4432 18.6828V15.447L27.6954 13.8215ZM30.4432 26.5528L30.4583 20.9999L33.2062 19.3744V28.1917L25.7266 32.5785V29.3275L30.4432 26.5528Z"
          fill="white"
        />
        <path
          d="M28.4729 25.4018L25.7251 27.0122V23.7764L28.4729 22.1509V25.4018Z"
          fill="white"
        />
        <path
          d="M28.4728 16.5981L28.4879 19.8491L23.7562 22.6255V28.1919L21.0083 29.8022L18.2605 28.1919V22.6255L13.5288 19.8491V16.5981L16.2884 14.9727L20.9915 17.7626L25.7233 14.9727L28.4846 16.5981H28.4728ZM13.5271 11.0469L20.9932 6.64502L28.4728 11.0469L25.7249 12.6724L20.9932 9.88252L16.2749 12.6724L13.5271 11.0469Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_495_2">
          <rect width="42" height="42" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
