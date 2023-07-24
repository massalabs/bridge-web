interface ISpinnerProps {
  customClass?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner(props: ISpinnerProps) {
  const { customClass, size = 'sm' } = props;

  const isSmall = size === 'sm';
  const isMedium = size === 'md';
  const sizeClass = isSmall
    ? 'w-6 h-6'
    : isMedium
    ? 'w-8 h-8'
    : 'w-12 h-12 border-4';

  return (
    <div
      className={`animate-spin ${sizeClass} rounded-full border-2 border-t-transparent
        border-neutral ${customClass}`}
    />
  );
}
