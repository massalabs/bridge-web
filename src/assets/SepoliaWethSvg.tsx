import sepoliaWethSvg from './SVG/sepolia_weth.svg';
import { SVGProps } from './svgInterface';

export function SepoliaWethSvg(props: SVGProps) {
  const { size } = props;
  return (
    <div className={`w-[${size ?? 44}px] h-[${size ?? 44}px]`}>
      <img src={sepoliaWethSvg} />
    </div>
  );
}
