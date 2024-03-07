import { SVGProps } from './BNBSvg';
import sepoliaWethSvg from './SVG/sepolia_weth.svg';

export function SepoliaWethSvg(props: SVGProps) {
  const { size } = props;
  return (
    <div className={`w-[${size ?? 44}px] h-[${size ?? 44}px]`}>
      <img src={sepoliaWethSvg} />
    </div>
  );
}
