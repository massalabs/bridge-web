import { RxCross2 } from 'react-icons/rx';

export function ErrorCheck({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  const isSmall = size === 'sm';
  const isMedium = size === 'md';
  const sizeClass = isSmall
    ? 'w-6 h-6'
    : isMedium
    ? 'w-8 h-8'
    : 'w-12 h-12 border-4';

  return (
    <div
      className={`${sizeClass} rounded-full bg-s-error/30 flex justify-center items-center border-none`}
    >
      <RxCross2 className="text-s-error w-full h-full p-1" />
    </div>
  );
}
