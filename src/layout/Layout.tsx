import { Button, Dropdown, ThemeMode } from '@massalabs/react-ui-kit';
import logo from '../assets/logo.svg';
export function Layout({ ...props }) {
  const { children } = props;

  const options = [
    {
      item: 'BuildNet',
    },
    {
      item: 'TestNet',
    },
  ];

  return (
    <div
      className="bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] 
      from-[#3271A5] to-deep-blue to-60%
      fixed w-full
      "
    >
      {/* Header Element */}
      <div className="flex flex-row items-center justify-between p-11 h-fit ">
        <img src={logo} alt="" />
        <div className="flex flex-row items-center gap-4">
          <Dropdown options={options} />
          <Button>Connect Wallet</Button>
          <ThemeMode />
        </div>
      </div>
      <div className={`min-h-screen flex flex-col justify-center items-center`}>
        {children}
      </div>
    </div>
  );
}
