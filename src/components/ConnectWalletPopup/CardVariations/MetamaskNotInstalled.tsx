export function MetamaskNotInstalled() {
  return (
    <>
      <p> It seems like you don't have metamask installed</p>
      <div>
        {/* Linting removes space here so i have to add it manually*/}
        Please follow this{' '}
        <u>
          <a href="https://metamask.io/download/" target="_blank">
            installation process
          </a>
        </u>
      </div>
    </>
  );
}
