import { BsCheckLg } from 'react-icons/bs';

export function SuccessCheck({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  const isSmall = size === 'sm';
  const isMedium = size === 'md';
  const sizeClass = isSmall
    ? 'w-6 h-6'
    : isMedium
    ? 'w-8 h-8'
    : 'w-12 h-12 border-4';

  return (
    <div
      className={`${sizeClass} rounded-full bg-s-success/30 flex justify-center items-center border-none`}
    >
      <BsCheckLg className="text-s-success w-full h-full p-1" />
    </div>
  );
}
