export function Layout({ ...props }) {
  const { children } = props;
  const gradientBlue = '#3271A5';
  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center
      bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] 
      from-[${gradientBlue}] to-deep-blue to-60%`}
    >
      {children}
    </div>
  );
}
