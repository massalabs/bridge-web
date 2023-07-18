export function ConnectMetamask({ ...props }) {
  // We'll need to add the mechnism that checks to see if metamask is connected

  const { src, isMetamaskConnected } = props;
  return (
    <div className="flex w-full gap-4">
      <div className="flex flex-col justify-between items-center w-fit">
        <img src={src} alt="metamask logo"></img>
        <div>Metamask</div>
      </div>

      <div className="mas-menu-default">
        If you want to get metamask <br /> <br /> <br />
        <a href="www.mylink.com" target="_blank">
          <u onClick={() => isMetamaskConnected(true)}>Click Here</u>
        </a>
      </div>
    </div>
  );
}
