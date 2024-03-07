import { SVGProps } from './BNBSvg';

export function SepoliaSvg(props: SVGProps) {
  let { size } = props;
  return (
    <svg
      width={size ?? 32}
      height={size ?? 32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="16" r="16" fill="white" />
      <path
        d="M15.8208 6L15.6936 6.43299V18.9962L15.8208 19.1234L21.6416 15.6763L15.8208 6Z"
        fill="#EECBC0"
        stroke="#363C99"
        strokeWidth="0.2"
      />
      <path
        d="M15.8209 6L10 15.6763L15.8209 19.1234V13.0255V6Z"
        fill="#B7FBFA"
        stroke="#363C99"
        strokeWidth="0.2"
      />
      <path
        d="M15.821 20.2274L15.7493 20.315V24.7902L15.821 24.9999L21.6453 16.7821L15.821 20.2274Z"
        fill="#EECBC0"
        stroke="#363C99"
        strokeWidth="0.2"
      />
      <path
        d="M15.8209 24.9999V20.2274L10 16.7821L15.8209 24.9999Z"
        fill="#C5B4F6"
        stroke="#363C99"
        strokeWidth="0.2"
      />
      <path
        d="M15.8208 19.1233L21.6416 15.6762L15.8208 13.0255V19.1233Z"
        fill="#87A9F1"
        stroke="#363C99"
        strokeWidth="0.2"
      />
      <path
        d="M10 15.6762L15.8209 19.1233V13.0255L10 15.6762Z"
        fill="#C9B3F4"
        stroke="#363C99"
        strokeWidth="0.2"
      />
    </svg>
  );
}
