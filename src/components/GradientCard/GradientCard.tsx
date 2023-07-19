import { ReactNode } from 'react';

interface GradientCardProps {
  children: ReactNode;
  customClass?: string;
}

export function GradientCard(props: GradientCardProps) {
  const { children, customClass } = props;

  return (
    <div
      className={`p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]
        from-[#3271A5] to-primary to-60% rounded-2xl flex flex-col items-center justify-center
        text-f-primary ${customClass}`}
    >
      {children}
    </div>
  );
}
