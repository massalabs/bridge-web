import { Button, Dropdown, Tag } from '@massalabs/react-ui-kit';
import metamask from '@/assets/metamask.svg';
import { FiUser } from 'react-icons/fi';

export function ConnectWalletCards() {
  function WalletCard({ ...props }) {
    const { children } = props;
    return (
      <div
        className="bg-primary w-full h-60 p-6 
                    rounded-2xl
                    flex flex-col justify-center items-center"
      >
        <div className="flex flex-col w-full mas-body">{children}</div>
      </div>
    );
  }

  const options = [
    {
      item: 'Account 1',
      icon: (
        <div className="w-4">
          <FiUser />
        </div>
      ),
    },
    {
      item: 'Account 2',
      icon: (
        <div className="w-4">
          <FiUser />
        </div>
      ),
    },
  ];

  return (
    <div className="pb-10 flex flex-row gap-4 text-f-primary">
      <div className="flex flex-col gap-4 min-w-[480px]">
        <WalletCard>
          <div className="flex justify-between w-full mb-4">
            <p>From: Sepolia testnet wallet </p>
            <Tag type="error" content="Not Connected" />
          </div>
          <div className="flex w-full gap-4">
            <div className="flex flex-col justify-between items-center w-fit">
              <img src={metamask} alt="metamask logo"></img>
              <div>Metamask</div>
            </div>

            <div className="mas-menu-default">
              If you want to get metamask <br /> <br /> <br />
              <a href="www.mylink.com" target="_blank">
                <u>Click Here</u>
              </a>
            </div>
          </div>
        </WalletCard>
        <WalletCard>
          <div className="flex justify-evenly w-full mb-4">
            <p>To: Massa testnet wallet </p>
            <Tag type="error" content="Not Connected" />
          </div>
          <div className="flex flex-col gap-4">
            <Dropdown options={options} />
            <Button>Select This Account</Button>
          </div>
        </WalletCard>
      </div>
      <div
        className="
        bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]
        from-[#3271A5] to-primary to-60%
        min-h-full w-[270px] p-6 rounded-2xl
        flex flex-col justify-evenly items-center gap-4
        "
      >
        <div className="flex flex-col justify-center items-center gap-4 mas-menu-default">
          <Tag type="info" content="Add Sepolia testnet" />
          If you want to add sepolia on your Metamask <br />
          <a href="www.mylink.com" target="_blank">
            <u>Click Here</u>
          </a>
        </div>
        <div className="w-full bg-slate-500 bg-opacity-5 border border-1"></div>
        <div className="flex flex-col justify-center items-center gap-4 mas-menu-default">
          <Tag type="success" content="Create a Massa Wallet" />
          If you want to add to create a Massa Wallet <br />
          <a href="www.mylink.com" target="_blank">
            <u>Click Here</u>
          </a>
        </div>
      </div>
    </div>
  );
}
